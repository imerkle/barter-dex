// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Main.css';

import FlipMove from 'react-flip-move';
import cx from 'classnames';

import BuySell from './BuySell';
import HeaderNav from './HeaderNav';
import { observer, inject } from 'mobx-react';
import { coinNameFromTicker, runCommand, makeCommand } from '../utils/basic.js';

const mockData = [
  {coin: "KMD",name:"Komodo",price: .5, volume: 44.40, change: 500 },
  {coin: "LTC",name:"Litecoin",price: 1.5, volume: 100.4, change: -4.5 },
];

@inject('HomeStore')
class MainPage extends Component {
  constructor(props){
    super(props);

    this.state = {
       currentCoin: { coin: "KMD", balance: 0, mock: true},
    };
  }
  componentDidMount = () => {  
    this.resetWallet();
    this.props.HomeStore.intervalTimer = setInterval(this.resetWallet, 10000);
  }
  resetWallet = () => {
  const { ROOT_DEX, coins, userpass, base } = this.props.HomeStore;
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
        /*
        runCommand(ROOT_DEX,makeCommand("pricearray",{base: o.coin, rel: base.coin}),(res)=>{
          //console.log(res);
          //console.log(o.coin);
        });
        */
        runCommand(ROOT_DEX,makeCommand("orderbook",{base: o.coin, rel: base.coin}),(res)=>{
          if(res.asks && res.asks[0]){
            coins[o.coin].value = res.asks[0].price * coins[o.coin].balance; 
            coins[o.coin].price = res.asks[0].price;
          }else{
            coins[o.coin].value = coins[o.coin].balance;
          }
          coins[o.coin].orderbook = res;
        });
      });
    })      
  }
  orderBookDisplay = (buyOrSell) => {
    const  { currentCoin } = this.state;
    const { coins, base }= this.props.HomeStore;
    let prop = "", header="", BS;
    switch(buyOrSell){
      case 0:
        prop = "bids";
        header = "Buy";
        BS = "buyState";
      break;
      case 1:
        prop = "asks";
        header = "Sell";
        BS = "sellState";
      break;
    }
    return (
              <div className={cx(styles.section, styles.buysell)}>
                 <div className={cx(styles.bs_tr, styles.bs_header,styles.bs_tr_row)}>
                  <div className={cx(styles.mainHead)}>{`${header} Orders`}</div>
                 </div>
                <div>       
                  <div className={cx(styles.tr, styles.section_header,styles.bs_order_header)}>
                    <div className={cx(styles.oneDiv,styles.coin)}>{`Price(${base.coin})`}</div>
                    <div className={cx(styles.oneDiv,styles.name)}>{`Amount(${currentCoin.coin})`}</div>
                    <div className={cx(styles.oneDiv,styles.price)}>{`Total(${base.coin})`}</div>
                  </div> 
                  <FlipMove duration={750} easing="ease-out">
                    {coins[currentCoin.coin].orderbook[prop].map( (o,i) =>{
                      const amt = o.maxvolume;
                      return (
                      <div className={cx(styles.tr)} key={o.coin+""+i} 

                        onClick={()=>{
                           this.props.HomeStore[BS].price = o.price;
                           this.props.HomeStore[BS].amount = amt;
                        }}
                      >
                        <div className={cx(styles.oneDiv,styles.price)}>{o.price}</div>
                        <div className={cx(styles.oneDiv,styles.volume)}>{amt}</div>
                        <div className={cx(styles.oneDiv,styles.volume)}>{o.price * amt}</div>
                      </div>
                      )
                    })}
                   </FlipMove>
                </div>       
           </div>
   );    
  }
  render() {
    const  { currentCoin } = this.state;
    const { coins, base }= this.props.HomeStore;
    return (
      <div className={styles.container, styles.container2}>
      <HeaderNav />
       <div className={styles.container}>
        <div className={styles.container2}>
           <div className={cx(styles.section, styles.r_side_bar)}>   
            <div className={cx(styles.tr, styles.section_header)}>
              <div className={cx(styles.oneDiv,styles.coin)}>Coin</div>
              <div className={cx(styles.oneDiv,styles.name)}>Name</div>
              <div className={cx(styles.oneDiv,styles.price)}>Price</div>
              <div className={cx(styles.oneDiv,styles.volume)}>Volume</div>
              <div className={cx(styles.oneDiv,styles.change)}>Change</div>
            </div> 
            <FlipMove duration={750} easing="ease-out">

              {Object.keys(coins).map( (k,v)=>{
                const o = coins[k];
                const change = (o.change) ? o.change : 0;
                return (
                <div className={cx(styles.tr,
                    {[styles.selectedtr]: currentCoin.coin == o.coin },
                    {[styles.basetr]: base.coin == o.coin }
                  )} key={o.coin}
                    onClick={()=>{
                      this.setState({ currentCoin: o });
                    }}
                  >
                  <div className={cx(styles.oneDiv,styles.coin)}>{o.coin}</div>
                  <div className={cx(styles.oneDiv,styles.name)}>{o.name}</div>
                  <div className={cx(styles.oneDiv,styles.price)}>{o.price}</div>
                  <div className={cx(styles.oneDiv,styles.volume)}>{o.volume}</div>
                  <div className={cx(styles.oneDiv,styles.change, ((change > 0) ? styles.profit : styles.loss ) )}>{((change > 0) ? "+" : "-" ) + change+"%"}</div>
                </div>
                )
              })}
             </FlipMove>        
            </div>
      	</div>
 	      <div className={styles.container2} style={{flex: "1 1 auto"}}>
        {
           /*
           <div className={cx(styles.section, styles.graph_bar)}>
              Graph Here
           </div>
           */
        } 
           
           <div className={cx(styles.section2, styles.bs_bar)}>
              <BuySell baseCoin={base} currentCoin={currentCoin} isBuy/>
              <BuySell baseCoin={base} currentCoin={currentCoin} isBuy={false} />           
           </div>



        <div className={cx(styles.section2, styles.bs_bar)}>
           {(coins[currentCoin.coin] && coins[currentCoin.coin].orderbook) ? this.orderBookDisplay(0) : ""}
           {(coins[currentCoin.coin] && coins[currentCoin.coin].orderbook) ? this.orderBookDisplay(1) : ""}
        </div>




    
        </div>
 	    </div>

      </div>
    );
  }
}
export default MainPage;