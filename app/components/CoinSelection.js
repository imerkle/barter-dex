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
  		coins: [{coin:"BTC", status: true,rpc: "127.0.0.1:8332",smartaddress: "0" }],
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

    shell.exec(`./getcoins`,(err, stdout, stderr) => {
        if(err){
        	DarkErrorStore.alert(err);
        	return false;
  		}
		const out = JSON.parse(stdout);
		const coins = out.coins || out;
		const c = coins.map(o=>{ 
			let isEnabled = false;
			if((lastEnabledCoins && lastEnabledCoins.indexOf(o.coin) > -1) || (o.status === 'active') ){
				isEnabled = true;
			}
			return {coin: o.coin, status: isEnabled,rpc: o.rpc, smartaddress: o.smartaddress, balance: o.balance }
		});
		this.setState({ coins: c });
  	});  	
  }
  _handleStartup = () => {
  	let enabled_coins = [];
  	this.state.coins.map(o=>{ 
  		if(o.status){
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
	this.props.history.push("/mainPage");

  	this.state.coins.map(o=>{
  		if(o.status){
  			runCommand(ROOT_DEX,makeCommand("enable",{coin: o.coin }),(res)=>{
  				console.log(res);
  			});
  		}
  	})

  	/*
  	let enable_my = `#!/bin/bash\nsource userpass \n`;

  	let enable_my_coins = "";
  	this.state.coins.map(o=>{
  		if(o.status){
  			
	  		const ipport = o.rpc.split(":");
	  		const jsonPart = {
	  				userpass: "$userpass",
	  				"method": "electrum",
	  				"coin": o.coin,
	  			};
			enable_my_coins += `curl --url "http://127.0.0.1:7783" --data "${JSON.stringify(jsonPart).replaceAll("\"","\\\"")}"\n`;
			
  			//runCommand(ROOT_DEX,makeCommand("enable",{coin: o.coin }),(res)=>{
  				//console.log(res);
  			//});
  		}
  	})
	enable_my += enable_my_coins;
	fs.writeFile(`${ROOT_DEX}enable_my`,enable_my,(err)=>{
		shell.exec(`./enable_my`,(err, stdout, stderr) => {
			if(err) DarkErrorStore.alert(err);
	    	this.props.history.push("/mainPage");
		});
	});  	
	*/

/*
	shell.cd(ROOT_DEX);
	shell.exec('./enable_my',(err,stdout,stderr)=>{
		console.log(err);
		console.log(stdout);
		console.log(stderr);
	});
*/
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
							              checked={o.status || false}
							              onChange={(event, checked) => {
							              	const c = this.state.coins;
											c.map(ox=> {
											  if(o.coin == ox.coin){
												ox.status = !ox.status;
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

