// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Main.css';

import FlipMove from 'react-flip-move';
import cx from 'classnames';

import { Paper, Tooltip, Icon, Typography } from 'material-ui';
import { observer, inject } from 'mobx-react';

import BuySell from './BuySell';
import HeaderNav from './HeaderNav';
import { makeConfig, coinNameFromTicker, getSorted, zeroGray } from '../utils/basic.js';
import { stylesY } from '../utils/constants.js';
import { withStyles } from 'material-ui/styles';
const MAX_VOLUME = .002;

let toggleState = {};

@withStyles(stylesY)
@inject('HomeStore','DarkErrorStore') @observer
class MainPage extends Component {
  constructor(props){
    super(props);

    this.state = {
       currentCoin: false,
       config : false,
    };
  }
  componentDidMount = () => {


    clearTimeout(this.props.HomeStore.checkIfRunningTimer);
    clearInterval(this.props.HomeStore.intervalTimer);
    clearInterval(this.props.HomeStore.intervalTimerBook);

    this.props.HomeStore.checkIfRunningTimer = null;
    this.props.HomeStore.intervalTimer = null;
    this.props.HomeStore.intervalTimerBook = null;

    this.orderBookCall();
    this.resetWallet();
    this.checkIfRunning();


    this.props.HomeStore.intervalTimer = setInterval(this.resetWallet, 20000);
    this.props.HomeStore.intervalTimerBook = setInterval(this.orderBookCall, this.props.HomeStore.orderBookRate);

  }
  componentWillUnmount = () => {


    clearTimeout(this.props.HomeStore.checkIfRunningTimer);
    clearInterval(this.props.HomeStore.intervalTimer);

    this.props.HomeStore.checkIfRunningTimer = null;
    this.props.HomeStore.intervalTimer = null;
  }  

  checkIfRunning = () => {
    this.props.HomeStore.isRunning().then((inUse)=>{
      if(!inUse){
        this.props.DarkErrorStore.alert("Marketmaker Stopped Running! ");
        this.props.history.push("/");
        return false;
      }
      this.props.HomeStore.checkIfRunningTimer = setTimeout(this.checkIfRunning, 3000);
    });
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
  orderBookCall = () => {
    ////coinNameFromTicker
  const { HomeStore } = this.props;
  const { coins, base } = HomeStore;
    Object.keys(coins).map((k,v)=>{
      const o = coins[k];
      if(o.coin != base.coin){
        HomeStore.runCommand("orderbook",{base: o.coin, rel: base.coin}).then((res)=>{
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
  }
  resetWallet = () => {
  const { HomeStore } = this.props;
  const { coins, base, maxdecimal } = HomeStore;

    Object.keys(coins).map((k,v)=>{
      const o = coins[k];
      HomeStore.runCommand("balance",{coin: o.coin, address: o.smartaddress}).then((res)=>{
         if(res.error){
          delete HomeStore.coins[o.coin];
          return false;
         } 
         if(res.result == "success"){
            coins[o.coin].balance = res.balance;
            if(o.coin == base.coin ) base.balance = res.balance;
         } 
      });
        coins[o.coin].orders = 0;
        if(base.coin != o.coin){
            HomeStore.runCommand("pricearray",{base: o.coin, rel: base.coin}).then((res)=>{
              if(res[res.length - 1]){
                const today = res[res.length - 1][1];
                const yesterday = res[0][1];
                const change = ((today - yesterday)/yesterday * 100).toFixed(2);
                coins[o.coin].change = change;
              }
            });
        }
    })      
  }
  orderBookDisplay = (buyOrSell) => {
    const  { currentCoin } = this.state;
    const { coins, base, maxdecimal }= this.props.HomeStore;
    let prop = "", header="", BS,placement;
    const { classes } = this.props;
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
              <Paper className={cx(styles.section, classes.AppSection, styles.buysell,
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
                    <div className={cx(styles.oneDiv,styles.utxos)}>{`Utxos`}</div>
                  </div> 
                  <FlipMove duration={750} easing="ease-out">
                    {coins[currentCoin.coin].orderbook[prop].map( (o,i) =>{
                      const amt = o.maxvolume.toFixed(maxdecimal);
                      const total = (o.price * amt).toFixed(maxdecimal);
                      const tooltip_title = o.address; 
                      const price = o.price.toFixed(maxdecimal);
                      const widthPercent = (total/MAX_VOLUME * 100)+"%";
                      const numutxos = o.numutxos;
                      return (
                      <Tooltip placement={placement} title={tooltip_title} key={o.coin+""+i+""+numutxos}>
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
                          <div className={cx(styles.oneDiv,styles.utxos)}>{numutxos}</div>
                        </div>
                       </Tooltip>
                      )
                    })}
                   </FlipMove>
                </div>       
           </Paper>
   );    
  }
  render() {
    const  { currentCoin } = this.state;
    const { coins, base, maxdecimal, enabled_coins }= this.props.HomeStore; 
    const { classes } = this.props;

    console.log(enabled_coins);
    
    return (
      <div className={styles.container, styles.container2}>
      <HeaderNav primary="exchange" />
       <div className={styles.container}>

        <div className={cx(styles.container2,styles.right_list)}>
           <table className={cx(styles.section,classes.AppSection,styles.r_side_bar)}>   
            <tr className={cx(styles.tr, styles.section_header, classes.AppSectionHeader, classes.AppSectionTypo)}>
              <th className={cx(styles.oneDiv,styles.coin)} onClick={()=>this.sortBy("coin")}>Coin</th>
              <th className={cx(styles.oneDiv,styles.name)} onClick={()=>this.sortBy("name")}>Name</th>
              <th className={cx(styles.oneDiv,styles.price)} onClick={()=>this.sortBy("price")}>Price</th>
              {/*<th className={cx(styles.oneDiv,styles.volume)} onClick={()=>this.sortBy("volume")}>Volume</th>*/}
              <th className={cx(styles.oneDiv,styles.change)} onClick={()=>this.sortBy("change")}>Change</th>
            </tr> 
            {/*<FlipMove duration={750} easing="ease-out">*/}
              {enabled_coins.map( (k,i) =>{
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
                <tr className={cx(styles.tr,
                    {[styles.selectedtr]: currentCoin.coin == o.coin },
                    {[styles.basetr]: base.coin == o.coin }
                  )} key={o.coin+""+i}
                    onClick={()=>{
                      if(o.coin == base.coin){
                        return false;
                      }
                      this.setState({ currentCoin: o });
                    }}
                  >
                  <td className={cx(styles.oneDiv,styles.coin)}>{o.coin}</td>
                  <td className={cx(styles.oneDiv,styles.name)}>{coinNameFromTicker(o.coin)}</td>
                  <td className={cx(styles.oneDiv,styles.price)}>{ zeroGray((price).toFixed(maxdecimal)) }</td>
                  <td className={cx(styles.oneDiv,styles.change,change_cl)}>{change_pref + change+"%"}</td>
                </tr>
                )
              })}
             {/*</FlipMove>*/}
            </table>
      	</div>
{ (this.state.currentCoin) ?
 	      <div className={styles.container2} style={{flex: "1 1 auto"}}>           
           <div className={cx(styles.section2, styles.bs_bar)}>
              <BuySell baseCoin={base} currentCoin={currentCoin} isBuy/>
            <BuySell baseCoin={base} currentCoin={currentCoin} isBuy={false} />           
           </div>
           <div className={cx(styles.section2, styles.bs_bar)}>
             {(coins[currentCoin.coin] && coins[currentCoin.coin].orderbook && coins[currentCoin.coin].orderbook.bids) ? this.orderBookDisplay(0) : ""}
             {(coins[currentCoin.coin] && coins[currentCoin.coin].orderbook && coins[currentCoin.coin].orderbook.asks) ? this.orderBookDisplay(1) : ""}
           </div>
        </div>
      : 
      <div className={styles.pad}>
        <Icon>chevron_left</Icon>
        <Typography type="headline" style={{ margin: "0 20px" }}>Select a Trading Pair</Typography>
      </div>
    }
 	    </div>
    </div>
    );
  }
}
export default MainPage;