// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Main.css';
import HeaderNav from './HeaderNav';

import LoadingWaitText from './LoadingWaitText';
import { Button, FormGroup, FormControlLabel, Typography, Switch } from 'material-ui';

import { history } from '../store/configureStore.js';


import { withStyles } from 'material-ui/styles';
import green from 'material-ui/colors/red';

import { ROOT_DEX } from '../utils/constants';
import fs from 'fs';
import shell from 'shelljs';


String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};


const timeoutSec = 4000;

const stylesX = {
  bar: {},
  checked: {
    color: green[500],
    '& + $bar': {
      backgroundColor: green[500],
    },
  },
};
 class CoinSelection extends Component {
  constructor(props){
  	super(props);

  	this.state = {
  		checked: {},
  		coins: [{coin:"BTC", status: true,rpc: "127.0.0.1:8332" }],
  		lastEnabledCoins: [],
  		ROOT_DEX: ROOT_DEX,
  	};
  }
  componentDidMount(){

    const ROOT_DEX = localStorage.getItem("ROOT_DEX");
    if(ROOT_DEX) this.setState({ ROOT_DEX });

  	this.setState({
  		passphrase: localStorage.getItem("passphrase"),
  	})
	let enabled_coins = localStorage.getItem("enabled_coins");
	  if(enabled_coins) enabled_coins = JSON.parse(enabled_coins);
    this.setState({ lastEnabledCoins: enabled_coins })	  
	
	shell.cd(ROOT_DEX);
	this.getCoins()
  }
  getCoins = () => {
    const { lastEnabledCoins, ROOT_DEX } = this.state;
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
			return {coin: o.coin, status: isEnabled,rpc: o.rpc }
		});
		this.setState({ coins: c });
  	});  	
  }
  _handleStartup = () => {
  	let enabled_coins = [];
  	this.state.coins.map(o=>{ if(o.status) enabled_coins.push(o.coin) })
  	localStorage.setItem("enabled_coins", JSON.stringify(enabled_coins));
  	this.saveCoins();
  }
  saveCoins = () => {
  	const { ROOT_DEX } = this.state;
  	let enable_my = `#!/bin/bash\nsource userpass \n`;

  	let enable_my_coins = "";
  	this.state.coins.map(o=>{
  		if(o.status){
	  		const ipport = o.rpc.split(":");
	  		const jsonPart = {
	  				userpass: "$userpass",
	  				"method": "electrum",
	  				"coin": o.coin,
	  				ipaddr: ipport[0], 
	  				port: ipport[1],
	  			};
			enable_my_coins += `curl --url "http://127.0.0.1:7783" --data "${JSON.stringify(jsonPart).replaceAll("\"","\\\"")}"\n`;
  		}
  	})

  	//remove this later need to ask dev
  	enable_my_coins = `curl --url "http://127.0.0.1:7783" --data "{\"userpass\":\"$userpass\",\"method\":\"electrum\",\"coin\":\"BTC\",\"ipaddr\":\"136.243.45.140\",\"port\":50001}"`;

	const cmd = `echo "${enable_my + enable_my_coins}" > ${ROOT_DEX}enable_my`;
	fs.writeFile(`${ROOT_DEX}enable_my`,enable_my,(err)=>{
	    history.push("/mainPage");
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
export default withStyles(stylesX)(CoinSelection);

