// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Main.css';
import HeaderNav from './HeaderNav';

import { Icon, Paper, Typography, Button } from 'material-ui';
import { observer, inject } from 'mobx-react';

import { withStyles } from 'material-ui/styles';
import { stylesY } from '../utils/constants';
import { coinLogoFromTicker } from '../utils/basic.js';
import FlipMove from 'react-flip-move';
import cx from 'classnames';
@withStyles(stylesY)
@inject('HomeStore','DarkErrorStore')
@observer
 class Orders extends Component {
  constructor(props){
  	super(props);
  }
  componentDidMount(){
  	this.props.HomeStore.getTradeHistory();
  }
  render() {
	const { classes, HomeStore } = this.props;
   	const { tradeHistory } = HomeStore;
    return (
       <div className={styles.container2}>
        <HeaderNav primary="orders" />
          <Paper className={cx(styles.section, classes.AppSection, styles.w_bar, styles.leftAlg)}>
          {(tradeHistory.length > 0) ? 

            <div className={cx(styles.tr, styles.section_header, classes.AppSectionHeader, classes.AppSectionTypo)}>
              <div className={cx(styles.oneDiv,styles.coin)}>Trade</div>
              <div className={cx(styles.oneDiv,styles.coin)}>Amount</div>
              <div className={cx(styles.oneDiv,styles.name)}>Status</div>
            </div> :

	           <Typography className={classes.AppSectionTypo} type="headline" component="h4">Trade History</Typography>
          }
  			{(tradeHistory.length > 0) ? 
            <FlipMove duration={750} easing="ease-out">
  				{tradeHistory.map(o=>{
  					return (
  					<div className={styles.tr} key={o.requestid}>
  						<div className={cx(styles.oneDiv,styles.coin)} style={{display:"flex"}}>
	  						{coinLogoFromTicker(o.alice)}
  							<Icon style={{margin: "0 6px 0 0"}} color="accent">arrow_forward</Icon>
  							{coinLogoFromTicker(o.bob)}
  						</div>	
              			<div className={cx(styles.oneDiv,styles.coin)}>{o.srcamount}</div>
              			<div className={cx(styles.oneDiv,styles.name)}>{o.status}</div>
  					</div>
  					);
  				})}
  			</FlipMove>
  			: 
  			<div className={styles.info}>No Trades to Show</div>
  			}
		   </Paper>	
       </div>
    );
  }
}
export default Orders;

