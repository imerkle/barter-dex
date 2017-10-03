// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Login.css';
import AppLogo from './AppLogo';
import { Button, FormGroup, FormControlLabel, Typography, Switch } from 'material-ui';

import { withStyles } from 'material-ui/styles';
import green from 'material-ui/colors/red';

import { exec } from 'child_process';
import { ROOT_DEX } from '../utils/constants';


const stylesX = {
  bar: {},
  checked: {
    color: green[500],
    '& + $bar': {
      backgroundColor: green[500],
    },
  },
};
 class StartupScreen extends Component {
  constructor(props){
  	super(props);

  	this.state = {
  		checked: {},
  		coins: [{"coin":"BTC", "status": true }],
  	};
  }
  componentDidMount(){
  	this.setState({
  		passphrase: localStorage.getItem("passphrase"),
  	})
  	exec(`
  		cd ${ROOT_DEX}
  		./getcoins
  		`,(err, stdout, stderr) => {
			const out = JSON.parse(stdout);
			const c = out.map(o=>{ return {coin: o.coin, status: o.status === 'active' }});
		this.setState({ coins: c });
  	});

  }
  _handleStartup = () => {
  	let enabled_coins = [];
  	this.state.coins.map(o=>{ if(o.status) enabled_coins.push(o.coin) })
  	console.log(enabled_coins);
  }
  render() {
	const { classes } = this.props;

    return (
       <div className={styles.container} data-tid="container">
       		<AppLogo />
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
    );
  }
}
export default withStyles(stylesX)(StartupScreen);

