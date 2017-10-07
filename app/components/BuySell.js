// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Main.css';
import cx from 'classnames';
import { Button, TextField } from 'material-ui';

const decimals = 2;
export default class BuySell extends Component {
  constructor(props){
  	super(props);
  	this.state = {
  		price: "",
  		total: "",
  		amount: "",
  	}
  }
  _handleFab = (percent) => {
  	const { isBuy, baseCoin, currentCoin } = this.props;
  	const balance = (isBuy) ? baseCoin.balance : currentCoin.balance;
  	let { price } = this.state;
  		price = parseFloat(price);
  	if(isNaN(price)) return false;
  	const total = (percent / 100  * balance);
  	const amount =  (total / price);
  	this.setState({ total, amount });
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

  	let amount = parseFloat(this.state.amount);
  	if(isNaN(amount)){
  		this.setState({ price })
  		return false;
  	};
  	const total =  ( amount * price);  	
  	this.setState({ total, price });
  }
  setAmount = (amount) => {

  	let price = parseFloat(this.state.price);
  	if(isNaN(price)){
  		this.setState({ amount })
  		return false;
  	};
  	const total =  ( amount * price);  	
  	this.setState({ total, amount });
  }
  render() {
  	const { currentCoin, baseCoin, isBuy } = this.props;
  	const { total, price, amount } = this.state;

  	const buyTxt = (isBuy)  ? "Buy" : "Sell";
  	const accent = (isBuy)  ? "accent" : "primary";
  	const primary = (isBuy)  ? "primary" : "accent";

  	const basetxt = (isBuy) ? `${baseCoin.balance} ${baseCoin.ticker}` : `${currentCoin.balance} ${currentCoin.ticker}`;
  	const basevalue = (isBuy) ? baseCoin.balance : currentCoin.balance;

    return (
	      <div className={cx(styles.section, styles.buysell)}>
	         <div className={cx(styles.bs_tr, styles.bs_header,styles.bs_tr_row)}>
	          <div className={cx(styles.mainHead)}>{`${buyTxt} ${currentCoin.ticker}`}</div>
	          <div className={cx(styles.basevalue)} onClick={()=>{ this._handleFab(100) }} >{basetxt}</div>
	         </div>
	         <div className={cx(styles.bs_tr)}><TextField value={price} label="Price" placeholder="Price" onChange={this._putPrice} /></div>
	         <div className={cx(styles.bs_tr)}><TextField value={amount} label="Amount" placeholder="Amount" onChange={this._putAmount} /></div>
	         <div className={cx(styles.bs_tr)}><TextField value={total} label="Total" disabled placeholder="Total" /></div>
	         <div className={cx(styles.bs_tr,styles.bs_tr_row)}>
	            <Button fab color={primary} onClick={()=>{ this._handleFab(25) }}>25%</Button>
	            <Button fab color={accent} onClick={()=>{ this._handleFab(50) }} >50%</Button>
	            <Button fab color={primary} onClick={()=>{ this._handleFab(75) }}>75%</Button>
	            <Button fab color={accent} onClick={()=>{ this._handleFab(100) }} >100%</Button>
	         </div>
	         <div className={cx(styles.bs_tr)}><Button raised color={accent}>{`${buyTxt} ${currentCoin.ticker}`}</Button></div>
	      </div>
    );
  }
}
