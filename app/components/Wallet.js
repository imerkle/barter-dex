// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Main.css';
import HeaderNav from './HeaderNav';
import cx from 'classnames';
import FlipMove from 'react-flip-move';
import { Button } from 'material-ui';
const mockWallet = [
{
	coin: "KMD",
	name: "Komodo" ,
	balance: 50,
	orders: 200,
	value: .5,
}
];
export default class Wallet extends Component {
  constructor(props){
  	super(props);
  	this.state = {
  		//wallet : [],
  		wallet : mockWallet,
  		baseCoin: {ticker: "BTC"}
  	};	
  }	
  componentDidMount(){

  }
  render() {
  	const { baseCoin, wallet } = this.state;
    return (
       <div className={styles.container2}>
       	 <HeaderNav />
         <div className={cx(styles.section, styles.w_bar)}>   
            <div className={cx(styles.tr, styles.section_header)}>
              <div className={cx(styles.oneDiv,styles.draw)}>Deposit/Withdraw</div>
              <div className={cx(styles.oneDiv,styles.coin)}>Coin</div>
              <div className={cx(styles.oneDiv,styles.name)}>Name</div>
              <div className={cx(styles.oneDiv,styles.price)}>Balance</div>
              <div className={cx(styles.oneDiv,styles.volume)}>On Orders</div>
              <div className={cx(styles.oneDiv,styles.change)}>{baseCoin.ticker} Value</div>
            </div>
            <FlipMove duration={750} easing="ease-out" style={{padding: "10px"}}>
              {wallet.map((o, i) => (
                <div className={styles.tr} key={o.coin}>
                  <div className={cx(styles.oneDiv,styles.draw)}>
                  	<Button raised color="accent">Deposit</Button>
                  	<Button raised color="primary">Withdraw</Button>
                  </div>
                  <div className={cx(styles.oneDiv,styles.coin)}>{o.coin}</div>
                  <div className={cx(styles.oneDiv,styles.name)}>{o.name}</div>
                  <div className={cx(styles.oneDiv,styles.price)}>{o.balance}</div>
                  <div className={cx(styles.oneDiv,styles.volume)}>{o.orders}</div>
                  <div className={cx(styles.oneDiv,styles.change)}>{o.value}</div>
                </div>
                ))}
             </FlipMove>                     
        </div>
       </div>
    );
  }
}