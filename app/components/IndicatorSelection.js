// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Main.css';
import HeaderNav from './HeaderNav';

import { TextField, Typography } from 'material-ui';


import { observer, inject } from 'mobx-react';


@inject('HomeStore','DarkErrorStore')
@observer
 class IndicatorSelection extends Component {
  constructor(props){
  	super(props);
  }
  render() {
   const { HomeStore } = this.props;
   const { indicator } = HomeStore;
    return (
       <div className={styles.container2}>
        <HeaderNav />
        <div className={styles.container2} style={{margin: "0 auto",padding: "0px 170px"}}>
           <Typography type="headline" component="h4">Change Button Indicator Values</Typography>
           {indicator.map((o,i)=>
           		(<TextField key={i} value={o} label={`Indicator ${i+1}`} placeholder={`Indicator ${i+1}`} onChange={(e)=>{
           			const value = e.target.value;
           			if(!isNaN(value) && value >0 && value <= 100){
           				HomeStore.indicator[i] = value;
           			}
           		}} />)
           )}
		  </div>	
       </div>
    );
  }
}
export default IndicatorSelection;

