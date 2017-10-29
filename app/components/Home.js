// @flow
import React, { Component } from 'react';
import styles from './Login.css';
import { HOME, ENABLE_COIN, marketmakerExe, coinsJSON } from '../utils/constants.js';
import { Paper, Icon, Button } from 'material-ui';
import wget from 'wget-improved';
import { exec } from 'child_process';
import { inject, observer } from 'mobx-react';
import fs from 'fs';
import AppLogo from './AppLogo';

@inject('HomeStore','DarkErrorStore') @observer
class Home extends React.Component {
  constructor(props){
  	super(props);



    const { HomeStore } = props;
    clearTimeout(HomeStore.checkIfRunningTimer);
    clearInterval(HomeStore.intervalTimer);
    clearInterval(HomeStore.intervalTimerBook);

    HomeStore.checkIfRunningTimer = null;
    HomeStore.intervalTimer = null;
    HomeStore.intervalTimerBook = null;

    HomeStore.debuglist = [];
    HomeStore.coins = {};
    HomeStore.enabled_coins = [];
    HomeStore.userpass = null;

  } 
  componentDidMount(){
    exec(`mkdir ${HOME}`,(err,stdout,stderr)=>{
      this.afterHomeDir();
    });
  }
  stopMarketmaker = () => {
    exec(`pkill -15 marketmaker`);    
    this.props.DarkErrorStore.alert("Marketmaker Killed",true);
  }
  afterHomeDir = () => {
      fs.exists(`${HOME}marketmaker`, (exists) => {
             if(!exists){
                const download = wget.download(marketmakerExe, HOME+'marketmaker');
                download.on('end', (output) => {
                  exec(`chmod +x ${HOME}marketmaker`);
                });
             }
          });
          const coinJSONTarget =  HOME+'coins.json';
          fs.exists(coinJSONTarget, (exists) => {
             if(!exists){
                const download = wget.download(coinsJSON, coinJSONTarget);
                download.on('end', (output) => {
                  this.saveAvailableCoins(coinJSONTarget);
                });
             }else{
                this.saveAvailableCoins(coinJSONTarget);
             }
          });    
          fs.readFile(`${HOME}${ENABLE_COIN}`,'utf8', (err,data) => {
            if(!err && data){
              const enabled_coins = JSON.parse(data);
              this.props.HomeStore.enabled_coins = enabled_coins.coin;
              this.props.HomeStore.makeUnique();
            }
          });
  }
  saveAvailableCoins = (coinJSONTarget) => {
        fs.readFile(coinJSONTarget,(err, data)=>{
          if(!err){
            this.props.HomeStore.available_coins = JSON.parse(data);
          }
        });    
  }
  render() {
    return (
      <div className={styles.container}>
        <AppLogo />
        <Paper className={styles.homeButtons}>
            <Button color="accent" raised onClick={()=>{
              this.props.history.push('/login');
            }}
            >Login</Button>
           <Button color="primary" raised onClick={()=>{
              this.props.history.push('/register');
            }}>Register</Button>
        </Paper>
           <Button color="accent" onClick={()=>{
              this.stopMarketmaker();
            }}>Stop Marketmaker</Button>
      </div>
    );
  }
}
export default Home;