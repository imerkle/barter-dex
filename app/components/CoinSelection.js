// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Main.css';
import HeaderNav from './HeaderNav';

import { Button, FormGroup, FormControlLabel, Typography, Switch } from 'material-ui';

import { withStyles } from 'material-ui/styles';

import { observer, inject } from 'mobx-react';
import { stylesY } from '../utils/constants';

import * as CryptoIcon from 'react-cryptocoins';
import LoadingWaitText from './LoadingWaitText';


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
const getCryptoIcon = (coin) => {
	let out = (null);
	switch (coin) {
		case 'KMD':
		    out = (<CryptoIcon.KmdAlt size={42} />);
		break;
		case 'NEO':
		    out = (<CryptoIcon.Neos size={42} />);
		break;
		default:
		    const Icon = CryptoIcon[capitalize(coin)];
		    if(!Icon){
		    	return (null);
		    }
		    out = (<Icon size={42} />);
		break;
	}
	return out;
}

@withStyles(stylesY)
@inject('HomeStore','DarkErrorStore')
@observer
 class CoinSelection extends Component {
  constructor(props){
  	super(props);

  	this.state = {
  		checked: {},
  		coins: [],
  	};
  }
  componentDidMount(){
	this.getCoins()
  }
  getCoins = () => {
  	const { HomeStore, DarkErrorStore } = this.props;

	HomeStore.runCommand('getcoins').then((res)=>{
		if(res.error){
			DarkErrorStore.alert(res.error);
			return false;
		}
		const c = res.map(o=>{
			let isEnabled = false;
			if((HomeStore.enabled_coins && HomeStore.enabled_coins.indexOf(o.coin) > -1) ){
				isEnabled = true;
			}
			return {coin: o.coin, status: o.status,rpc: o.rpc, smartaddress: o.smartaddress, balance: o.balance, enabled: isEnabled }
		});
		this.setState({ coins: c });
	})
  }
  render() {
	const { classes, DarkErrorStore, HomeStore } = this.props;

    return (
       <div className={styles.container2}>
       	<HeaderNav />
		<div className={styles.container2} style={{margin: "0 auto",padding: "0px 170px"}}>
			        	<Typography type="headline" component="h4">Select Coins to Trade</Typography>
			        	{(this.state.coins.length < 1) ? <LoadingWaitText text="Generating Coin List" /> : ""}
						 <FormGroup className={styles.switchGroup}>
							 {
							 	this.state.coins.map((o,i)=>(
							 	<div className={styles.switches} key={i}>
							 		{/*getCryptoIcon(o.coin)*/}
								 	<div>
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
								              	if(checked){

									              	HomeStore.runCommand('enable',{coin: o.coin}).then((res)=>{
									              		if(res.error){
									              			DarkErrorStore.alert(res.error);
									              			//return false;
									              		}
									              		HomeStore.coins[o.coin] = o;
									              		HomeStore.enabled_coins.push(o.coin);
									              		this.setState({ checked: c })
									              	});
								              	}else{
									              	HomeStore.enabled_coins.remove(o.coin);
									              	delete HomeStore.coins[o.coin];

									              	HomeStore.runCommand('disable',{coin: o.coin}).then((res)=>{
									              		if(res.error){
									              			DarkErrorStore.alert(res.error);
									              			//return false;
									              		}
								              			HomeStore.coins[o.coin] = o;
									              		HomeStore.enabled_coins.push(o.coin);
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
								          label={o.coin}
								        /> 
								      </div>	
							      </div>	
							 	))
							 }
						 </FormGroup>
						{/*<Button raised color="primary" onClick={this._handleStartup}>Save</Button>*/}
					</div>	
       </div>
    );
  }
}

export default CoinSelection;

