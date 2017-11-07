
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Main.css';

import { Paper } from 'material-ui';
import { observer, inject } from 'mobx-react';
import Highcharts from 'highcharts';
import ReactHighcharts from 'react-highcharts';
import { zeroGray, makeConfig , coinLogoFromTicker, coinNameFromTicker } from '../utils/basic.js';

import cx from 'classnames';
@inject('HomeStore','DarkErrorStore') @observer
class Chart extends Component {
  constructor(props){
    super(props);
  }
  render(){
    const { HomeStore } = this.props;
    const coin = HomeStore.currentCoin.coin;

    const price = HomeStore.coins[coin].price || 0;
    const change = HomeStore.coins[coin].change || 0;
    const priceHistory = HomeStore.coins[coin].priceHistory || [];
    const config = makeConfig(priceHistory, HomeStore.currentCoin.ticker, HomeStore.maxdecimal, change, HomeStore.base.coin);

    let pl = styles.nothing,suff="";
    if(change > 0){
    	pl = styles.profit;
    	suff="+";
    }else if(change < 0){
    	pl= styles.loss;
    }
  	  return (
           <Paper className={cx(styles.section2, styles.container2)} style={{width: "95%",margin: "0 auto"}}>
              	<div className={styles.container} style={{ padding: "30px",alignItems: "center", }}>
              		{coinLogoFromTicker(coin)}
              		{coinNameFromTicker(coin)}
              		<span style={{margin: "0 10px"}}>{zeroGray(price)}{HomeStore.base.coin}</span>
              		<span className={cx(pl)} style={{margin: "0 10px"}}>{suff+change+"%"}</span>
              	</div>
  	  			<ReactHighcharts config={config}></ReactHighcharts>
           </Paper>  	  	
  	  	);
  }
}

export default Chart;