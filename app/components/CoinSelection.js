// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Main.css';
import HeaderNav from './HeaderNav';

import LoadingWaitText from './LoadingWaitText';
import { Button, FormGroup, FormControlLabel, Typography, Switch } from 'material-ui';

import { withStyles } from 'material-ui/styles';

import fs from 'fs';
import shell from 'shelljs';
import { observer, inject } from 'mobx-react';
import { stylesX } from '../utils/constants';
import { runCommand, makeCommand } from '../utils/basic.js';

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};


const timeoutSec = 4000;

@withStyles(stylesX)
@inject('HomeStore','DarkErrorStore')
@observer
 class CoinSelection extends Component {
  constructor(props){
  	super(props);

  	this.state = {
  		checked: {},
  		coins: [{coin:"BTC", enabled: true,rpc: "127.0.0.1:8332",smartaddress: "0" }],
  		lastEnabledCoins: [],
  	};
  }
  componentDidMount(){

  	const { ROOT_DEX, enabled_coins, passphrase } = this.props.HomeStore;
  	
  	this.setState({
  		passphrase: passphrase,
  		lastEnabledCoins: enabled_coins,
  	})
	shell.cd(ROOT_DEX);
	this.getCoins()
  }
  getCoins = () => {
    const { lastEnabledCoins } = this.state;
  	const { ROOT_DEX } = this.props.HomeStore;
  	const { DarkErrorStore } = this.props;

    shell.exec(`./getcoins`,(err, stdout, stderr) => {
        if(err){
        	DarkErrorStore.alert(err);
        	return false;
  		}
		const out = JSON.parse(stdout);
		const coins = out.coins || out;
		const c = coins.map(o=>{ 
			let isEnabled = false;
			if((lastEnabledCoins && lastEnabledCoins.indexOf(o.coin) > -1) ){
				isEnabled = true;
			}
			return {coin: o.coin, status: o.status,rpc: o.rpc, smartaddress: o.smartaddress, balance: o.balance, enabled: isEnabled }
		});
		this.setState({ coins: c });
  	});  	
  }
  _handleStartup = () => {
  	let enabled_coins = [];
  	this.state.coins.map(o=>{ 
  		if(o.enabled){
  			enabled_coins.push(o.coin);
  			let newC = {};
  			if(this.props.HomeStore.coins[o.coin]) newC = this.props.HomeStore.coins[o.coin];
  			newC = Object.assign(newC,o)
  			this.props.HomeStore.coins[o.coin] = newC;
  		}
  	})
  	//localStorage.setItem("enabled_coins", JSON.stringify(enabled_coins));
  	this.props.HomeStore.enabled_coins = enabled_coins;
  	this.saveCoins();
  }
  saveCoins = () => {
  	const { ROOT_DEX } = this.props.HomeStore;
  	let c = 0,c1=0;
  	this.state.coins.map(o=>{ if(o.enabled) c++; })
  	this.state.coins.map((o,i)=>{
  		if(o.enabled){
  			c1++;
  			runCommand(ROOT_DEX,makeCommand("enable",{coin: o.coin }),(res)=>{
  				if(c == c1){
  					this.props.history.push("/mainPage");
  				}
  			});
  		}
  	})
  }
  render() {
	const { classes } = this.props;

    return (
       <div className={styles.container2}>
       	<HeaderNav />
		<div className={styles.container2} style={{margin: "0 auto",padding: "0px 170px"}}>
			        	<Typography type="headline" component="h4">Select Coins to Trade</Typography>
						 <FormGroup className={styles.switchGroup}>
							 {
							 	this.state.coins.map((o,i)=>(
							 	<div className={styles.switches} key={i} >
							        <FormControlLabel
							          control={
							            <Switch
							              checked={o.enabled || false}
							              onChange={(event, checked) => {
							              	const c = this.state.coins;
											c.map(ox=> {
											  if(o.coin == ox.coin){
												ox.enabled = !ox.enabled;
											   }
											});
							              	this.setState({ checked: c })	
							          	  }}
								         classes={{
								            checked: classes.checked,
								            bar: classes.bar,
								          }}					          	  
							            />
							          }
							          label={o.coin}
							        /> 
							      </div>	
							 	))
							 }
						 </FormGroup>
						<Button raised color="primary" onClick={this._handleStartup}>Save</Button>	
					</div>	
       </div>
    );
  }
}
export default CoinSelection;

