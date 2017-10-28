// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Main.css';
import cx from 'classnames';
import { Paper, Button, TextField } from 'material-ui';
import { inject, observer } from 'mobx-react';

import { withStyles } from 'material-ui/styles';
import { stylesY } from '../utils/constants';

import * as CryptoIcon from 'react-cryptocoins';
import AButton from './AButton';




@withStyles(stylesY)
@inject('HomeStore','DarkErrorStore')
@observer
class BuySell extends Component {
  constructor(props){
  	super(props);
    this.BS = (props.isBuy) ? "buyState" : "sellState";
  }
  _inventory = (coin) => {
    const { HomeStore } = this.props;

      return new Promise((resolve, reject) =>  HomeStore.runCommand("inventory",{ coin: coin }).then((result) => {
          if (result.alice.length < 3) {
            const address = result.alice[0].address;
            HomeStore.runCommand("withdraw",{ outputs: [{ [address]: 0.001 }, { [address]: 0.002 }] , coin: result.alice[0].coin }).then((withdrawResult) => {
                  HomeStore.runCommand("sendrawtransaction",{ coin, signedtx: withdrawResult.hex }).then(() => {
                      resolve(result);
                  })
              })
          } else {
              resolve(result);
          }
      }).catch((error) => {
          console.log(`error inventory ${coin}`)
          reject(error);
      }));
  }
  _handleBuySell = () => {
  	 const { isBuy, baseCoin, currentCoin, HomeStore, DarkErrorStore } = this.props;

    let volume,method; 
    return new Promise((resolve, reject) => {

          //we buying my current or we buying api base
          //api rel = currency paying with  = my base
          //api base = currency i wanna buy  = my current      
      if(isBuy){
         method = "buy";
         volume = { relvolume: HomeStore[this.BS].total };
        }else{
          method = "sell";
          volume = { basevolume: HomeStore[this.BS].amount };
        }
       this._inventory(baseCoin.coin).then(() => {
          HomeStore.runCommand(method, {base: currentCoin.coin, rel: baseCoin.coin, price: HomeStore[this.BS].price, ...volume  }).then((res)=>{
            if(res.error){
              DarkErrorStore.alert(res.error);
            }
              resolve();
          });
       });

    });          
  }
    fixDecimal = (n) =>{
      return +n.toFixed(this.props.HomeStore.maxdecimal)
    }  
  _handleFab = (percent) => {
    const { isBuy, baseCoin, currentCoin, HomeStore } = this.props;
  	const balance = (isBuy) ? baseCoin.balance : currentCoin.balance;
  	let { price } = this.props.HomeStore[this.BS];
  	price = parseFloat(price);

    let amount,total;
  	if(isNaN(price)) return false;
    if(isBuy){
      total = this.fixDecimal(percent / 100  * balance);
      amount =  this.fixDecimal(total / price);
    }else{
      amount = this.fixDecimal(percent / 100  * balance);
      total =  this.fixDecimal(amount* price);
    }
    
    HomeStore[this.BS].total = total;
    HomeStore[this.BS].amount = amount;
  	//this.setState({ total, amount });
  }
  _putPrice = (e) => {
  	const price = e.target.value.replace(/[^0-9.]/g, '');
  	this.setPrice(price);
  }
  _putAmount = (e) => {
  	const amount = e.target.value.replace(/[^0-9.]/g, '');
  	this.setAmount(amount);
  }    
  setPrice = (price) => {
    const { HomeStore } = this.props;
    
    let amount = parseFloat(HomeStore[this.BS].amount);
    if(isNaN(amount)){
      HomeStore[this.BS].price = price
      return false;
    };
    const total =  this.fixDecimal( amount * price);   

    HomeStore[this.BS].total = total;
    HomeStore[this.BS].price = price;
    //this.setState({ total, price });
  }
  setAmount = (amount) => {
    const { HomeStore } = this.props;

  	let price = parseFloat(HomeStore[this.BS].price);
  	if(isNaN(price)){
      HomeStore[this.BS].amount = amount;
      //this.setState({ amount })
      return false;
    };
    const total = this.fixDecimal( amount * price );   

    HomeStore[this.BS].total = total;
    HomeStore[this.BS].amount = amount;
  	//this.setState({ total, amount });
  }
  render() {
  	const { currentCoin, baseCoin, isBuy, classes } = this.props;
  	const { total, price, amount } = this.props.HomeStore[this.BS];
    const { indicator } = this.props.HomeStore;

  	const buyTxt = (isBuy)  ? "Buy" : "Sell";
  	const accent = (isBuy)  ? "accent" : "primary";
  	const primary = (isBuy)  ? "primary" : "accent";

  	const basetxt = (isBuy) ? `${baseCoin.balance} ${baseCoin.coin}` : `${currentCoin.balance} ${currentCoin.coin}`;
  	const basevalue = (isBuy) ? baseCoin.balance : currentCoin.balance;

    const CryptoSVGLogo = CryptoIcon[capitalize(currentCoin.coin)];
    let CoinLogo = (<span></span>);
    if(CryptoSVGLogo){
        CoinLogo = (<CryptoSVGLogo color="#fbbf40" style={{margin: "0px 10px -6px 0px" }} />);
    }
    return (
	      <Paper className={cx(styles.section, classes.AppSection, styles.buysell,
          {[classes.BuySection]: isBuy},
          {[classes.SellSection]: !isBuy},
          )}>
	         <div className={cx(styles.bs_tr, styles.bs_header,styles.bs_tr_row)}>
	          <div className={cx(styles.mainHead)}>
            {CoinLogo}
            {`${buyTxt} ${currentCoin.coin}`}</div>
	          <div className={cx(styles.basevalue)} onClick={()=>{ this._handleFab(100) }} >{basetxt}</div>
	         </div>
	         <div className={cx(styles.bs_tr)}><TextField value={price} label="Price" placeholder="Price" onChange={this._putPrice} /></div>
	         <div className={cx(styles.bs_tr)}><TextField value={amount} label="Amount" placeholder="Amount" onChange={this._putAmount} /></div>
	         <div className={cx(styles.bs_tr)}><TextField value={total} label="Total" disabled placeholder="Total" /></div>
	         <div className={cx(styles.bs_tr,styles.bs_tr_row)}>
              {indicator.map( (o,i)=><Button key={i} fab color={(i%2 == 0) ?  accent : primary} onClick={()=>{ this._handleFab(o) }}>{o}%</Button>)}
	         </div>
	         <div className={cx(styles.bs_tr)}><AButton raised color={accent} onClick={this._handleBuySell}>{`${buyTxt} ${currentCoin.coin}`}</AButton></div>
	      </Paper>
    );
  }
}
const capitalize = (name) => {
     return name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
export default BuySell;