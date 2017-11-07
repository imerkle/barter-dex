// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Main.css';
import HeaderNav from './HeaderNav';

import { Icon, Paper, Typography, Button } from 'material-ui';
import { observer, inject } from 'mobx-react';

import { withStyles } from 'material-ui/styles';
import { stylesY } from '../utils/constants';
import { labelDisp, coinLogoFromTicker, makeButton, zeroGray } from '../utils/basic.js';
import FlipMove from 'react-flip-move';
import cx from 'classnames';
import AButton from './AButton';

@withStyles(stylesY)
@inject('HomeStore','DarkErrorStore')
@observer
 class Orders extends Component {
  constructor(props){
  	super(props);
  }
  componentDidMount(){
    this.props.HomeStore.getTradeHistory();
  	this.props.HomeStore.getBotList();
  }
  render() {
	const { classes, HomeStore } = this.props;
  const { tradeHistory, bots } = HomeStore;
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

      <Paper className={cx(styles.section, classes.AppSection, styles.w_bar, styles.leftAlg)}>
        <Typography className={classes.AppSectionTypo} type="headline" component="h4">Bots</Typography>
        {(bots.length > 0) ? 
          bots.map(o=>{
            let title, color,from,to,from_vol,to_vol,price,isBuy;
            if(o.action == 'buy'){
              title = "Buy";
              color = "accent";
              from = o.rel;
              to = o.base;

              from_vol = o.totalrelvolume;
              to_vol = o.totalbasevolume;
              price = o.maxprice;
              isBuy = true;
            }else{
              title = "Sell";
              color = "primary";
              from = o.base;
              to = o.rel;
              
              from_vol = o.totalbasevolume;
              to_vol = o.totalrelvolume;              
              price = o.minprice;
              isBuy = false;
            }

            const pauseButton = {};
            if(o.paused){
              pauseButton.title = "resume";
              pauseButton.icon = "play_arrow";
              pauseButton.color="accent";
              pauseButton.method="bot_resume";
            }else{
              pauseButton.title = "pause";
              pauseButton.icon = "pause";
              pauseButton.color = "primary";
              pauseButton.method="bot_pause";
            }

            return (
              <div className={cx(styles.tr,styles.col)}>
              <div className={cx(styles.tr, styles.trflex)}>
                <div className={cx(styles.bflex,styles.widthauto)}>
                  {coinLogoFromTicker(from, true)}
                  <Icon>arrow_forward</Icon>
                  {coinLogoFromTicker(to, true)}
                </div>
                <div className={styles.botpercentageholder}>
                  <div className={styles.botpercentage} style={{ width: `${o.percentage}%` }}></div>
                </div>
                <div>
                  <AButton color={pauseButton.color} disabled={o.stopped}
                  onClick={()=>{
                    return new Promise((resolve, reject) => {
                      HomeStore.runCommand(pauseButton.method,{botid: o.botid}).then((res)=>{
                        if(res.error){
                          DarkErrorStore.alert(res.error);
                        }else{
                          DarkErrorStore.alert(`Bot ${o.botid} ${pauseButton.title}d`,true);
                        }
                        resolve();
                      });
                    });
                  }}>{makeButton(pauseButton.title, pauseButton.icon, true)}</AButton>                
                  <AButton raised color="primary" disabled={o.stopped}
                  onClick={()=>{
                    return new Promise((resolve, reject) => {
                      HomeStore.runCommand("bot_stop",{botid: o.botid}).then((res)=>{
                        if(res.error){
                          DarkErrorStore.alert(res.error);
                        }else{
                          DarkErrorStore.alert(`Bot ${o.botid} Stopped`,true);
                        }
                        resolve();
                      });
                    });
                  }}>{makeButton("Stop", "stop", true)}</AButton>
                </div>
              </div>

                <div className={cx(styles.tr, styles.col)}>
                  <div className={cx(styles.bflex,styles.widthauto)}>
                    <Icon className={styles.bigbot} color={color}>android</Icon>
                    <div className={styles.col}>
                      {labelDisp("Amount", (isBuy) ? `${to_vol} ${to}` : `${from_vol} ${from}`)}
                      {labelDisp("Total", (isBuy) ? `${from_vol} ${from}` : `${to_vol} ${to}`)}
                      {labelDisp("Price", (isBuy) ? `${price} ${from}/${to}` : `${price} ${to}/${from}`)}
                    </div>
                  </div>
                </div>

              </div>
            );
          })
        : <div className={styles.info}>No Bots Running</div>
        }
       </Paper> 

       </div>
    );
  }
}
export default Orders;

