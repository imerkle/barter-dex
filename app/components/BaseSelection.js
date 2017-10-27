// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Main.css';
import HeaderNav from './HeaderNav';

import { Paper, Button, Typography } from 'material-ui';
import { observer, inject } from 'mobx-react';
import { action } from 'mobx';

import { withStyles } from 'material-ui/styles';
import { stylesY } from '../utils/constants';

@withStyles(stylesY)
@inject('HomeStore','DarkErrorStore')
@observer
 class BaseSelection extends Component {
  constructor(props){
  	super(props);
  }
  @action setBase = (k) => {
      this.props.HomeStore.base.coin = k;
      

      const index = HomeStore.enabled_coins.indexOf(base.coin);
      HomeStore.enabled_coins.splice(index, 1);
      HomeStore.enabled_coins.unshift(base.coin);
  }
  render() {
	 const { classes, HomeStore } = this.props;
   const { base, coins } = HomeStore;
    return (
       <div className={styles.container2}>
        <HeaderNav />
        <Paper className={styles.container2} style={{margin: "0 auto"}}>
           <Typography className={classes.AppSectionTypo} type="headline" component="h4">Change Base Coin ( Current {base.coin} )</Typography>
            <div className={styles.container_buttons} style={{padding: "30px 170px"}}>
              {Object.keys(coins).map((k,v)=>{
                return(<Button key={k} raised={(base.coin == k)} color="accent" onClick={()=>{
                  this.setBase(k)
                }}>{k}</Button>)
              })}
            </div>  
					</Paper>	
       </div>
    );
  }
}
export default BaseSelection;

