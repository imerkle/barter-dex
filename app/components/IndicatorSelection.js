// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Main.css';
import HeaderNav from './HeaderNav';

import { Paper, TextField, Typography } from 'material-ui';


import { observer, inject } from 'mobx-react';

import { withStyles } from 'material-ui/styles';
import { stylesY } from '../utils/constants';

@withStyles(stylesY)
@inject('HomeStore','DarkErrorStore')
@observer
 class IndicatorSelection extends Component {
  constructor(props){
  	super(props);
  }
  render() {
   const { HomeStore, classes } = this.props;
   const { indicator, orderBookRate } = HomeStore;
    return (
       <div className={styles.container2}>
        <HeaderNav />
        <Paper className={styles.container2} style={{margin: "0 auto",padding: "0px 170px"}}>
           <Typography className={classes.AppSectionTypo} type="headline" component="h4">Change Button Indicator Values</Typography>
           {indicator.map((o,i)=>
           		(<TextField key={i} value={o} label={`Indicator ${i+1}`} placeholder={`Indicator ${i+1}`} onChange={(e)=>{
           			const value = e.target.value;
           			if(!isNaN(value) && value >0 && value <= 100){
           				HomeStore.indicator[i] = value;
           			}
           		}} />)
           )}
           <Typography className={classes.AppSectionTypo} type="headline" component="h4">Change OrderBook refresh rate</Typography>
			<TextField value={orderBookRate} label={`Orderbook Refresh Rate`} placeholder={`Orderbook Refresh Rate`} onChange={(e)=>{
           			const value = e.target.value;
           			if(!isNaN(value) && value >0){
           				HomeStore.setValue("orderBookRate",value);
           			}
           		}} />           
		  </Paper>	
       </div>
    );
  }
}
export default IndicatorSelection;

