// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Main.css';

import FlipMove from 'react-flip-move';
import cx from 'classnames';
import ReactHighcharts from 'react-highcharts';
import ReactHighstock from 'react-highcharts/ReactHighstock.src';
import { Tooltip } from 'material-ui';
import { observer, inject } from 'mobx-react';

import BuySell from './BuySell';
import HeaderNav from './HeaderNav';
import { makeConfig, coinNameFromTicker, runCommand, makeCommand, getSorted, zeroGray } from '../utils/basic.js';
import { green } from '../utils/chartTheme.js';

const MAX_VOLUME = .002;

ReactHighstock.Highcharts.theme = green;
ReactHighstock.Highcharts.setOptions(ReactHighstock.Highcharts.theme);

const mockData = [
  {coin: "KMD",name:"Komodo",price: .5, volume: 44.40, change: 500 },
  {coin: "LTC",name:"Litecoin",price: 1.5, volume: 100.4, change: -4.5 },
];

let toggleState = {};
@inject('HomeStore') @observer
class MainPage extends Component {
  constructor(props){
    super(props);

    this.state = {
       currentCoin: { coin: "KMD", balance: 0, mock: true},
       config : false,
       graphVisible: false,
    };
  }
  componentDidMount = () => {  
    this.resetWallet();
    clearInterval(this.props.HomeStore.intervalTimer);
    this.props.HomeStore.intervalTimer = null;
    this.props.HomeStore.intervalTimer = setInterval(this.resetWallet, 60000);
  }

  sortBy = (prop) => {
    return false;
    let data = [];
    let data_new;
    let asc = (toggleState[prop]) ? true : false;
    toggleState[prop] = !asc;
    switch(prop){
      case 'name':
      case 'coin':
        data_new = (asc) ? data.sort((a, b) => a[prop].localeCompare(b[prop])) : data.sort((b, a) => a[prop].localeCompare(b[prop]))  
      break;
      default:
        data_new = getSorted(asc,data, prop);
      break;
    }
    if(data) this.setState({ data });
  }   
  resetWallet = () => {
  const { ROOT_DEX, coins, userpass, base, maxdecimal } = this.props.HomeStore;
    const wallet = [];
    Object.keys(coins).map((k,v)=>{
      const o = coins[k];
      if(o.coin != base.coin && v < 2 && this.state.currentCoin.mock){
        this.setState({ currentCoin: o })
      }
      coins[k] = Object.assign(o, {name: coinNameFromTicker(o.coin)});
      wallet.push({ coin: o.coin, smartaddress: o.smartaddress })
    })
    wallet.map(o=>{
      runCommand(ROOT_DEX,makeCommand("balance",{coin: o.coin, address: o.smartaddress}),(res)=>{
       if(res.error){
        delete this.props.HomeStore.coins[o.coin];
        return false;
       } 
       if(res.result == "success"){
          coins[o.coin].balance = res.balance;
          if(o.coin == base.coin ) base.balance = res.balance;
        } 
        coins[o.coin].orders = 0;
        /*       
        runCommand(ROOT_DEX,makeCommand("myprice",{base: base.ticker, rel: o.coin}),(res)=>{
          if(res.error){
            coins[o.coin].orders = 0;  
          }
        });
        */
        
        
        if(base.coin != o.coin){
        runCommand(ROOT_DEX,makeCommand("pricearray",{base: o.coin, rel: base.coin}),(res)=>{
          const today = res[res.length - 1][1];
          const yesterday = res[0][1];
          const change = ((today - yesterday)/yesterday * 100).toFixed(2);
          coins[o.coin].change = change;
          if(!this.madeGraph){
            this.setState({ config: makeConfig(res, base.coin, maxdecimal) });
            this.madeGraph = true;
          }
        });
        
        
          runCommand(ROOT_DEX,makeCommand("orderbook",{base: o.coin, rel: base.coin}),(res)=>{
            //console.log(res);
            if(res.asks && res.asks[0]){
              coins[o.coin].value = res.asks[0].price * coins[o.coin].balance; 
              coins[o.coin].price = res.asks[0].price;
            }else{
              coins[o.coin].value = coins[o.coin].balance;
            }
            coins[o.coin].orderbook = res;
          });
        }

      });
    })      
  }
  orderBookDisplay = (buyOrSell) => {
    const  { currentCoin } = this.state;
    const { coins, base, maxdecimal }= this.props.HomeStore;
    let prop = "", header="", BS,placement;
    switch(buyOrSell){
      case 0:
        prop = "bids";
        header = "Buy";
        BS = "sellState";
        placement="top";
      break;
      case 1:
        prop = "asks";
        header = "Sell";
        BS = "buyState";
        placement="bottom";
      break;
    }
    return (
              <div className={cx(styles.section, styles.buysell,
                {[styles.buyBox] : buyOrSell == 0 },
                {[styles.sellBox] : buyOrSell == 1},
                )}>
                 <div className={cx(styles.bs_tr, styles.bs_header,styles.bs_tr_row)}>
                  <div className={cx(styles.mainHead)}>{`${header} Orders`}</div>
                 </div>
                <div>       
                  <div className={cx(styles.tr, styles.section_header,styles.bs_order_header)}>
                    <div className={cx(styles.oneDiv,styles.price)}>{`Price(${base.coin})`}</div>
                    <div className={cx(styles.oneDiv,styles.volume)}>{`Amount(${currentCoin.coin})`}</div>
                    <div className={cx(styles.oneDiv,styles.total)}>{`Total(${base.coin})`}</div>
                  </div> 
                  <FlipMove duration={750} easing="ease-out">
                    {coins[currentCoin.coin].orderbook[prop].map( (o,i) =>{
                      const amt = o.maxvolume.toFixed(maxdecimal);
                      const total = (o.price * amt).toFixed(maxdecimal);
                      const tooltip_title = o.address; 
                      const price = o.price.toFixed(maxdecimal);
                      const widthPercent = (total/MAX_VOLUME * 100)+"%";
                      return (
                      <Tooltip placement={placement} title={tooltip_title} key={o.coin+""+i}>
                        <div className={cx(styles.tr , { [styles.myorder] : o.address == currentCoin.smartaddress } )}  
                          onClick={()=>{
                             this.props.HomeStore[BS].price = o.price;
                             this.props.HomeStore[BS].amount = amt;
                             this.props.HomeStore[BS].total = total;
                          }}
                        >
                          <div className={cx(styles.volumeSpread)} style={{ width: widthPercent }}></div>
                          <div className={cx(styles.oneDiv,styles.price)}>{zeroGray(price)}</div>
                          <div className={cx(styles.oneDiv,styles.volume)}>{zeroGray(amt)}</div>
                          <div className={cx(styles.oneDiv,styles.total)}>{zeroGray(total)}</div>
                        </div>
                       </Tooltip>
                      )
                    })}
                   </FlipMove>
                </div>       
           </div>
   );    
  }
  render() {
    const  { currentCoin } = this.state;
    const { coins, base, maxdecimal }= this.props.HomeStore;
    return (
      <div className={styles.container, styles.container2}>
      <HeaderNav />
       <div className={styles.container}>
        <div className={cx(styles.container2,styles.right_list)}>
           <div className={cx(styles.section, styles.r_side_bar)}>   
            <div className={cx(styles.tr, styles.section_header)}>
              <div className={cx(styles.oneDiv,styles.coin)} onClick={()=>this.sortBy("coin")}>Coin</div>
              <div className={cx(styles.oneDiv,styles.name)} onClick={()=>this.sortBy("name")}>Name</div>
              <div className={cx(styles.oneDiv,styles.price)} onClick={()=>this.sortBy("price")}>Price</div>
              {/*<div className={cx(styles.oneDiv,styles.volume)} onClick={()=>this.sortBy("volume")}>Volume</div>*/}
              <div className={cx(styles.oneDiv,styles.change)} onClick={()=>this.sortBy("change")}>Change</div>
            </div> 
            <FlipMove duration={750} easing="ease-out">

              {Object.keys(coins).map( (k,v)=>{
                const o = coins[k];
                const change = o.change || 0;
                const price = (o.coin == base.coin) ? 1 : o.price || 0;
                const volume = o.volume || 0;

                let change_cl="",change_pref="";
                if(change > 0){
                  change_pref = "+";
                  change_cl = styles.profit;
                }else if(change < 0){
                  //change_pref = "-";
                  change_cl = styles.loss;
                }else{
                  change_pref = "";
                  change_cl = styles.nothing;
                }

                return (
                <div className={cx(styles.tr,
                    {[styles.selectedtr]: currentCoin.coin == o.coin },
                    {[styles.basetr]: base.coin == o.coin }
                  )} key={o.coin}
                    onClick={()=>{
                      if(o.coin == base.coin){
                        return false;
                      }
                      this.setState({ currentCoin: o });
                    }}
                  >
                  <div className={cx(styles.oneDiv,styles.coin)}>{o.coin}</div>
                  <div className={cx(styles.oneDiv,styles.name)}>{o.name}</div>
                  <div className={cx(styles.oneDiv,styles.price)}>{ zeroGray((price).toFixed(maxdecimal)) }</div>
                  {/*<div className={cx(styles.oneDiv,styles.volume)}>{zeroGray(volume)}</div>*/}
                  <div className={cx(styles.oneDiv,styles.change,change_cl)}>{change_pref + change+"%"}</div>
                </div>
                )
              })}
             </FlipMove>        
            </div>
      	</div>
 	      <div className={styles.container2} style={{flex: "1 1 auto"}}>
        {
           (this.state.config) ?  
           <div className={cx(styles.section, styles.graph_bar)}>
              <div className={cx(styles.tr, styles.section_header)} onClick={()=>{ this.setState({ graphVisible: !this.state.graphVisible }) }}>{currentCoin.coin}/{base.coin}  Graph</div>
              <div className={cx({ [styles.invisible] : !this.state.graphVisible })}>
                <ReactHighstock theme={ReactHighcharts.Highcharts.theme} config={this.state.config}></ReactHighstock>
              </div>
           </div> : ""
        } 
           
           <div className={cx(styles.section2, styles.bs_bar)}>
              <BuySell baseCoin={base} currentCoin={currentCoin} isBuy/>
              <BuySell baseCoin={base} currentCoin={currentCoin} isBuy={false} />           
           </div>



        <div className={cx(styles.section2, styles.bs_bar)}>
           {(coins[currentCoin.coin] && coins[currentCoin.coin].orderbook && coins[currentCoin.coin].orderbook.bids) ? this.orderBookDisplay(0) : ""}
           {(coins[currentCoin.coin] && coins[currentCoin.coin].orderbook && coins[currentCoin.coin].orderbook.asks) ? this.orderBookDisplay(1) : ""}
        </div>




    
        </div>
 	    </div>

      </div>
    );
  }
}
export default MainPage;