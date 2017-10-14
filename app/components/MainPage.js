// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Main.css';

import FlipMove from 'react-flip-move';
import cx from 'classnames';

import BuySell from './BuySell';
import HeaderNav from './HeaderNav';

const mockData = [
  {coin: "KMD",name:"Komodo",price: .5, volume: 44.40, change: 500 },
  {coin: "LTC",name:"Litecoin",price: 1.5, volume: 100.4, change: -4.5 },
];
export default class MainPage extends Component {
  constructor(props){
    super(props);

    this.state = {
       coins: [],
       currentCoin: { ticker: "KMD", balance: 45},
       baseCoin: {ticker: "BTC", balance: 1.4},
    };
  }
  componentDidMount(){
    const enabled_coins = JSON.parse(localStorage.getItem("enabled_coins"))
    let coins = [];
    mockData.map(o=>{
      if(enabled_coins.indexOf(o.coin) > -1) coins.push(o);
    });
    this.setState({ coins: coins });
  }
  render() {
    const  { currentCoin, baseCoin } = this.state;
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
            <FlipMove duration={750} easing="ease-out" style={{padding: "10px"}}>
              {this.state.coins.map((o, i) => (
                <div className={styles.tr} key={o.coin}>
                  <div className={cx(styles.oneDiv,styles.coin)}>{o.coin}</div>
                  <div className={cx(styles.oneDiv,styles.name)}>{o.name}</div>
                  <div className={cx(styles.oneDiv,styles.price)}>{o.price}</div>
                  <div className={cx(styles.oneDiv,styles.volume)}>{o.volume}</div>
                  <div className={cx(styles.oneDiv,styles.change, ((o.change > 0) ? styles.profit : styles.loss ) )}>{((o.change > 0) ? "+" : "-" ) + o.change+"%"}</div>
                </div>
                ))}
             </FlipMove>         
            </div>
      	</div>
 	      <div className={styles.container2} style={{flex: "1 1 auto"}}>
           <div className={cx(styles.section, styles.graph_bar)}>
              Graph Here
           </div>
           
           <div className={cx(styles.section2, styles.bs_bar)}>
              <BuySell baseCoin={baseCoin} currentCoin={currentCoin} isBuy/>
              <BuySell baseCoin={baseCoin} currentCoin={currentCoin} isBuy={false} />           
           </div>
           <div className={cx(styles.section, styles.trades_bar)}>
            <div className={cx(styles.section_header)}>Recent Trades</div> 
           </div>           
        </div>
 	    </div>

      </div>
    );
  }
}
