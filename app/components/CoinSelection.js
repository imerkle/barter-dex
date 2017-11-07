// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Main.css';
import HeaderNav from './HeaderNav';

import { Icon, Paper, TextField ,Button, FormGroup, FormControlLabel, Typography, Switch } from 'material-ui';

import { withStyles } from 'material-ui/styles';

import { observer, inject } from 'mobx-react';
import { HOME, ENABLE_COIN, stylesY, electrumIP, electrumPorts } from '../utils/constants';
import { coinNameFromTicker, coinLogoFromTicker } from '../utils/basic';

import LoadingWaitText from './LoadingWaitText';

import fs from 'fs';
import cx from 'classnames';

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

const capitalize = (string) => string.toLowerCase().charAt(0).toUpperCase() + string.slice(1).toLowerCase()

const timeoutSec = 4000;

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

//const whitelist = ["BTC","LTC","DASH","KMD","HUSH","REVS","CHIPS","MNZ"];

@withStyles(stylesY)
@inject('HomeStore','DarkErrorStore')
@observer
 class CoinSelection extends Component {
  constructor(props){
  	super(props);

  	this.state = {
  		checked: {},
  		coins: [],
  		q: "",
  	};
  }
  componentDidMount(){
	this.getCoins();
  }
  getCoins = () => {
  	const { HomeStore, DarkErrorStore } = this.props;

  	if(!HomeStore.allCoins || HomeStore.allCoins.length < 1){
		HomeStore.runCommand('getcoins').then((res)=>{
			if(res.error){
				DarkErrorStore.alert(res.error);
				return false;
			}
			HomeStore.allCoins = res;
			this.setCoins();
		})
	}else{
		this.setCoins();
	}
  }
  setCoins = () => {
  	const { HomeStore } = this.props;
	let c = [];
	HomeStore.allCoins.map(o=>{
		//if(whitelist.indexOf(o.coin) > -1){
			let isEnabled = false;
			if((HomeStore.enabled_coins && HomeStore.enabled_coins.indexOf(o.coin) > -1) ){
				isEnabled = true;
			}
			const x = {coin: o.coin, status: o.status,rpc: o.rpc, smartaddress: o.smartaddress, balance: o.balance,txfee: o.txfee, enabled: isEnabled };
			if(isEnabled){
				this.props.HomeStore.coins[o.coin] = x;
			}
			c.push(x);
		//}
	});
		this.setState({ coins: c });
  }
  saveCoinsinJSON = () => {
  	const new_json = {
  		coin: this.props.HomeStore.enabled_coins,
  	};
  	fs.writeFile(`${HOME}${ENABLE_COIN}`,JSON.stringify(new_json),()=>{})
  }
  render() {
	const { classes, DarkErrorStore, HomeStore } = this.props;
	const { q } = this.state;
    return (
       <div className={styles.container2}>
       	<HeaderNav />
		<Paper className={cx(styles.container2,styles.containerbig)}>
			        	<Typography className={cx(classes.AppSectionTypo)} type="headline" component="h4">Select Coins to Trade</Typography>
			        	{(this.state.coins.length < 1) ? <LoadingWaitText text="Generating Coin List" /> : ""}

			        	<TextField value={q} label="Search" placeholder="Search" onChange={(e)=>{
						 	this.setState({ q: e.target.value.toLowerCase() })
						 }} style={{ margin: "20px" }}/>
						 <FormGroup className={styles.switchGroup}>
							 {
							 	this.state.coins.map((o,i)=>{

							 	if(q.length > 0){
							 		let isValid = false;
							 		if(o.coin.toLowerCase().indexOf(q) > -1 || coinNameFromTicker(o.coin).toLowerCase().indexOf(q) > -1 ){
							 			isValid = true;
							 		}
							 		if(!isValid){
							 			return (null);
							 		}
							 	}
							 	return(
							 	<div className={styles.switches} key={i}>
								 	<div>
								        <FormControlLabel
								          control={
								            <Switch
								              checked={o.enabled || false}
								              onChange={(event, checked) => {
								              	const c = this.state.coins;								              	
								              	if(checked){
								              		const method = (electrumPorts[o.coin]) ? "electrum" : "";
										              	HomeStore.runCommand('enable',{coin: o.coin}).then((res)=>{
										              		if(res.error){
										              			if(electrumPorts[o.coin]){
										              				electrumIP.map(ox=>{
									              						HomeStore.runCommand(method,{coin: o.coin, ipaddr: ox,port: electrumPorts[o.coin] });
										              				});
										              				DarkErrorStore.alert("Native Blockchain not available, activating Electrum servers");
										              			}else{
										              				DarkErrorStore.alert("Native Blockchain not available.");
											              			return false;
										              			}
										              		}
										              		HomeStore.coins[o.coin] = o;
										              		HomeStore.enabled_coins.push(o.coin);
										              		HomeStore.makeUnique();

	            											if(HomeStore.enabled_coins[0]){
											                	HomeStore.base = {coin: HomeStore.enabled_coins[0]};
											              	}									              	

															c.map(ox=> {
															  if(o.coin == ox.coin){
																ox.enabled = !ox.enabled;
															   }
															});											              		

										              		this.saveCoinsinJSON();
										              		this.setState({ checked: c })
									              });
								              	}else{
									              	HomeStore.runCommand('disable',{coin: o.coin}).then((res)=>{
									              		if(res.error){
									              			DarkErrorStore.alert("Native Blockchain not available!");
									              			return false;
									              		}
									              		HomeStore.enabled_coins.remove(o.coin);
									              		delete HomeStore.coins[o.coin];
									              		HomeStore.makeUnique();
             											if(HomeStore.enabled_coins[0]){
										                	HomeStore.base = {coin: HomeStore.enabled_coins[0]};
										              	}
														c.map(ox=> {
														  if(o.coin == ox.coin){
															ox.enabled = !ox.enabled;
														   }
														});										              	
									              		
									              		this.saveCoinsinJSON();
									              		this.setState({ checked: c })
									              	});									              	
								              	}
								          	  }}
									         classes={{
									            checked: classes.checked,
									            bar: classes.bar,
									          }}					          	  
								            />
								          }
								          label={logoAndName(o.coin)}
								        /> 
								      </div>	
							      </div>	
							 	)})
							 }
						 </FormGroup>
						{/*<Button raised color="primary" onClick={this._handleStartup}>Save</Button>*/}
						<Button raised color="accent" onClick={()=>{
							this.props.history.push("/mainPage");
						}}>
				             <div className={styles.bflex}>
				                  <div className={styles.bflextxt}>Continue to Exchange</div>
				                  <Icon className={styles.bflexicon}>exit_to_app</Icon>
				               </div>
						</Button>
					</Paper>	
       </div>
    );
  }
}
const logoAndName = (coin) => {
	return (
		<span>
			{coinLogoFromTicker(coin)}
			{coin}
		</span>
		);
}
export default CoinSelection;

