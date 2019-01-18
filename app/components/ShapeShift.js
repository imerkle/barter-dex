// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Main.css';

import FlipMove from 'react-flip-move';
import cx from 'classnames';

import { ListItem,List,IconButton,Toolbar,AppBar, Dialog, TextField, Paper, Button, Tooltip, Icon, Typography } from 'material-ui';
import { observer, inject } from 'mobx-react';
import { action } from 'mobx';

import BuySell from './BuySell';
import HeaderNav from './HeaderNav';
import { coinLogoFromTicker, makeConfig, coinNameFromTicker, getSorted, zeroGray, makeButton, labelDisp } from '../utils/basic.js';
import { stylesY } from '../utils/constants.js';
import { withStyles } from 'material-ui/styles';
import LoadingWaitText from './LoadingWaitText';
import Chart from './Chart.js';
import Slide from 'material-ui/transitions/Slide';
import AButton from './AButton';
const priceCheckRate = 8000;
const priceHistoryRate = 8000;


const Transition = (props) => {
  return <Slide direction="up" {...props} />;
}

@withStyles(stylesY)
@inject('HomeStore','DarkErrorStore') @observer
class ShapeShift extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			next: false,
			total: 0,
			amount: 0,
			open: false,
			coinIndex: "base",
		};
	}
	 componentDidMount = () => {

	    const { HomeStore }  = this.props;

	    clearTimeout(HomeStore.checkIfRunningTimer);
	    clearInterval(HomeStore.intervalTimer);
	    clearInterval(HomeStore.intervalTimerBook);
	    clearInterval(HomeStore.intervalTimerHistory);

	    HomeStore.checkIfRunningTimer = null;
	    HomeStore.intervalTimer = null;
	    HomeStore.intervalTimerBook = null;
	    HomeStore.intervalTimerHistory = null;

	    //this.myorderbook();
	    HomeStore.resetWallet();
	    this.checkIfRunning();


	    HomeStore.intervalTimer = setInterval(HomeStore.resetWallet, priceCheckRate);
	    HomeStore.intervalTimer = setInterval(HomeStore.getWalletPriceHistory, priceHistoryRate);
	  }
	  componentWillUnmount(){
	    clearInterval(this.intervalTimerPrice);
	    this.intervalTimerPrice = null;
	  }
	  @action checkIfRunning = () => {
	    this.props.HomeStore.isRunning().then((inUse)=>{
	      if(!inUse){
	        this.props.DarkErrorStore.alert("Marketmaker Stopped Running! ");
	        this.props.history.push("/");
	        return false;
	      }
	      this.props.HomeStore.checkIfRunningTimer = setTimeout(this.checkIfRunning, 3000);
	    });
	  }	  
	switchBaseCurrent = () => {
		const { HomeStore } = this.props;
		const tmp_base = HomeStore.base;
		HomeStore.base = HomeStore.currentCoin;
		HomeStore.currentCoin = tmp_base;
		HomeStore.setValue("currentPrice",0);
	}
	_putAmount = (e) => {
		const amount = e.target.value.replace(/[^0-9.]/g, '');
		this._setAmount(amount);
	}
	_putTotal = (e) => {
		const total = e.target.value.replace(/[^0-9.]/g, '');
		this._setTotal(total);
	}
	_setAmount = (amount) => {
		const total = amount * this.props.HomeStore.currentPrice;
		this.setState({ total,amount });		
	}
	_setTotal = (total)=> {
		const amount = total / this.props.HomeStore.currentPrice;
		this.setState({ total,amount });
	}


	  handleClickOpen = () => {
	    this.setState({ open: true });
	  };

	  handleRequestClose = () => {
	    this.setState({ open: false });
	  };

	renderDialog = () => {
		const { HomeStore } = this.props;
	 	const { enabled_coins, base, currentCoin } = HomeStore;
	 	const mapArr = enabled_coins.filter(x => [base.coin,currentCoin.coin].indexOf(x) == -1);
		return(
 		<Dialog fullScreen
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
          transition={Transition} >
	          <AppBar>
	            <Toolbar>
	              <IconButton color="contrast" onClick={this.handleRequestClose}><Icon>close</Icon></IconButton>
	            </Toolbar>
	          </AppBar>
	          <List className={cx(styles.coinList)}>
	          	{mapArr.map(o=>(
	          				<ListItem button onClick={()=>{
	          					HomeStore[this.state.coinIndex] = HomeStore.coins[o];
	          					this.handleRequestClose();
	          				}}>
	          					{coinLogoFromTicker(o)}
	          					<div className={styles.boxhead}>{coinNameFromTicker(o)}</div>
	          				</ListItem>
	          		))}
	          </List>
        </Dialog>  			
			);		
	}
	render(){
		const { classes, HomeStore, DarkErrorStore } = this.props;
		const { currentCoin, base, currentPrice } = HomeStore;
		const { next, amount, total } = this.state;

		if(next){
			return (
		      	 <div className={styles.container, styles.container2}>
		      		<HeaderNav primary="exchange" />
					<Paper className={cx(styles.section, classes.AppSection, styles.container2)} >
						<Typography className={cx(classes.AppSectionTypo, styles.bflex)} style={{ display: "flex",flexDirection: "row" }}>
						<Button color="primary" onClick={()=>{
							this.setState({ next: false });
						}}><Icon>arrow_back</Icon></Button>
						<div>{`Your Rate 1 ${base.coin} = ${(1/currentPrice).toFixed(8)} ${currentCoin.coin}`}</div>
						</Typography>
						<div className={cx(styles.buysell, styles.shapeshiftbox, styles.boxcon2)}>
							<div className={styles.boxes}>
								{coinLogoFromTicker(base.coin)}
								<span onClick={()=>{this._setTotal(base.balance)}}>{labelDisp("",`${base.balance} ${base.coin}`)}</span>
								<TextField disabled={(currentPrice == 0)} value={`${total}`} label={`You Spend ${base.coin}`} placeholder={`You Spend ${base.coin}`} onChange={(e)=>{this._putTotal(e)}}/>
							</div>							
							<div className={styles.boxes} ><Icon className={styles.compareIcon}>forward</Icon></div>
							<div className={styles.boxes}>
								{coinLogoFromTicker(currentCoin.coin)}
								<span onClick={()=>{this._setAmount(currentCoin.balance)}}>{labelDisp("",`${currentCoin.balance} ${currentCoin.coin}`)}</span>
								<TextField disabled={(currentPrice == 0) } value={`${amount}`} label={`You Get ${currentCoin.coin}`} placeholder={`You Get ${currentCoin.coin}`} onChange={(e)=>{this._putAmount(e)}} />
							</div>							
						</div>
						<AButton 
						disabled={(currentPrice == 0)}
						onClick={()=>{
						return new Promise((resolve, reject) => {
        					const volume = this.state.total;
        					const opts = {base: base.coin, rel: currentCoin.coin, basevolume: volume, minprice: 1/currentPrice };
				          HomeStore.runCommand("bot_sell", opts).then((res)=>{
				            if(res.error){
				              DarkErrorStore.alert(res.error);
				            }else{
				              DarkErrorStore.alert("Order Logged!", true);
				            }
				            resolve();
				          });	
				        });	
					}} raised color="accent">{makeButton("Swap","swap_calls")}</AButton>
					</Paper>
				  </div>				
			);
		}
		return (
      	 <div className={styles.container, styles.container2}>
      		<HeaderNav primary="exchange" />
    		{this.renderDialog()}

			<Paper className={cx(styles.section, classes.AppSection, styles.container2)} >
				<Typography className={cx(classes.AppSectionTypo)}>Choose Which Assets to Trade</Typography>
				<div className={cx(styles.buysell, styles.shapeshiftbox)}>
					<div className={styles.boxes} onClick={()=>{
						this.setState({ coinIndex: "base" });
						this.handleClickOpen();
					}}>
						<div className={styles.boxhead}>Sell</div>
						{coinLogoFromTicker(base.coin)}
						<div className={styles.boxhead}>{coinNameFromTicker(base.coin)}</div>
					</div>					
					<div className={styles.boxes} onClick={this.switchBaseCurrent}><Icon className={styles.compareIcon}>compare_arrows</Icon></div>
					<div className={styles.boxes} 
					onClick={()=>{
						this.setState({ coinIndex: "currentCoin" });
						this.handleClickOpen();
					}}>
						<div className={styles.boxhead}>Buy</div>
						{coinLogoFromTicker(currentCoin.coin)}
						<div className={styles.boxhead}>{coinNameFromTicker(currentCoin.coin)}</div>
					</div>					
				</div>
				<Button onClick={()=>{
					this.setState({ next: true });
					HomeStore.setValue("currentPrice", 0);
				}} raised color="accent">{makeButton("Next","forward")}</Button>
			</Paper>
		  </div>
		);
	}
}
export default ShapeShift;