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

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};


const timeoutSec = 4000;

@withStyles(stylesX)
@inject('HomeStore')
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
        	alert(err);
        	return false;
  		}
		const out = JSON.parse(stdout);
		const coins = out.coins || out;
		const c = coins.map(o=>{ 
			let isEnabled = false;
			if((lastEnabledCoins && lastEnabledCoins.indexOf(o.coin) > -1) || (o.status === 'active') ){
				isEnabled = true;
			}
			return {coin: o.coin, status: isEnabled,rpc: o.rpc, smartaddress: o.smartaddress }
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
  		}
  	})

  	//remove this later need to ask dev
  	/*
  	enable_my_coins = `
curl --url "http://127.0.0.1:7783" --data "{\"userpass\":\"$userpass\",\"method\":\"electrum\",\"coin\":\"ARG\",\"ipaddr\":\"173.212.225.176\",\"port\":50081}"
curl --url "http://127.0.0.1:7783" --data "{\"userpass\":\"$userpass\",\"method\":\"electrum\",\"coin\":\"BTC\",\"ipaddr\":\"136.243.45.140\",\"port\":50001}"
curl --url "http://127.0.0.1:7783" --data "{\"userpass\":\"$userpass\",\"method\":\"electrum\",\"coin\":\"BTC\",\"ipaddr\":\"173.212.225.176\",\"port\":50001}"
curl --url "http://127.0.0.1:7783" --data "{\"userpass\":\"$userpass\",\"method\":\"electrum\",\"coin\":\"CRW\",\"ipaddr\":\"173.212.225.176\",\"port\":50041}"
curl --url "http://127.0.0.1:7783" --data "{\"userpass\":\"$userpass\",\"method\":\"electrum\",\"coin\":\"DASH\",\"ipaddr\":\"173.212.225.176\",\"port\":50098}"
curl --url "http://127.0.0.1:7783" --data "{\"userpass\":\"$userpass\",\"method\":\"electrum\",\"coin\":\"DGB\",\"ipaddr\":\"136.243.45.140\",\"port\":50022}"
curl --url "http://127.0.0.1:7783" --data "{\"userpass\":\"$userpass\",\"method\":\"electrum\",\"coin\":\"DGB\",\"ipaddr\":\"173.212.225.176\",\"port\":50022}"
curl --url "http://127.0.0.1:7783" --data "{\"userpass\":\"$userpass\",\"method\":\"electrum\",\"coin\":\"DOGE\",\"ipaddr\":\"173.212.225.176\",\"port\":50015}"
curl --url "http://127.0.0.1:7783" --data "{\"userpass\":\"$userpass\",\"method\":\"electrum\",\"coin\":\"FAIR\",\"ipaddr\":\"173.212.225.176\",\"port\":50005}"
curl --url "http://127.0.0.1:7783" --data "{\"userpass\":\"$userpass\",\"method\":\"electrum\",\"coin\":\"HUSH\",\"ipaddr\":\"173.212.225.176\",\"port\":50013}"
curl --url "http://127.0.0.1:7783" --data "{\"userpass\":\"$userpass\",\"method\":\"electrum\",\"coin\":\"KMD\",\"ipaddr\":\"136.243.45.140\",\"port\":50011}"
curl --url "http://127.0.0.1:7783" --data "{\"userpass\":\"$userpass\",\"method\":\"electrum\",\"coin\":\"KMD\",\"ipaddr\":\"173.212.225.176\",\"port\":50011}"
curl --url "http://127.0.0.1:7783" --data "{\"userpass\":\"$userpass\",\"method\":\"electrum\",\"coin\":\"LTC\",\"ipaddr\":\"173.212.225.176\",\"port\":50012}"
curl --url "http://127.0.0.1:7783" --data "{\"userpass\":\"$userpass\",\"method\":\"electrum\",\"coin\":\"MONA\",\"ipaddr\":\"173.212.225.176\",\"port\":50002}"
curl --url "http://127.0.0.1:7783" --data "{\"userpass\":\"$userpass\",\"method\":\"electrum\",\"coin\":\"NMC\",\"ipaddr\":\"173.212.225.176\",\"port\":50036}"
curl --url "http://127.0.0.1:7783" --data "{\"userpass\":\"$userpass\",\"method\":\"electrum\",\"coin\":\"VTC\",\"ipaddr\":\"173.212.225.176\",\"port\":50088}"
curl --url "http://127.0.0.1:7783" --data "{\"userpass\":\"$userpass\",\"method\":\"electrum\",\"coin\":\"ZEC\",\"ipaddr\":\"173.212.225.176\",\"port\":50032}"
  	`;
  	*/
	enable_my += enable_my_coins;
	fs.writeFile(`${ROOT_DEX}enable_my`,enable_my,(err)=>{
		shell.exec(`./enable_my`,(err, stdout, stderr) => {
			if(err)alert(err);
	    	this.props.history.push("/mainPage");
		});
	});  	
  }
  render() {
	const { classes } = this.props;

    return (
       <div className={styles.container2}>
       	<HeaderNav />
		<div className={styles.container2} style={{margin: "0 auto"}}>
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

