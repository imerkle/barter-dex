// @flow
import React, { Component } from 'react';
import styles from './Login.css';
import { HOME, ENABLE_COIN, marketmakerName,marketmakerExe, coinsJSON, platform } from '../utils/constants.js';
import { Paper, Icon, Button } from 'material-ui';
import wget from 'wget-improved';
import { exec } from 'child_process';
import { inject, observer } from 'mobx-react';
import fs from 'fs';
import AppLogo from './AppLogo';
import AButton from './AButton.js';

@inject('HomeStore','DarkErrorStore') @observer
class Home extends React.Component {
  constructor(props){
  	super(props);
    this.state = {
      downloadComplete: false,
    }
  } 
  componentDidMount(){
    this.clearTimeouts();

    exec(`mkdir ${HOME}`,(err,stdout,stderr)=>{
      this.afterHomeDir();
    });
    this.stopMarketMaker();
  }
  clearTimeouts = () => {

    const { HomeStore } = this.props;

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
  stopMarketMaker = () => {
    const cmd = platform === 'win32' ? `taskkill /f /im ${marketmakerName}` : `pkill -15 ${marketmakerName}`;
    exec(cmd);
  }
  afterHomeDir = () => {
      fs.exists(`${HOME}${marketmakerName}`, (exists) => {
             if(!exists){
                const download = wget.download(marketmakerExe, HOME+marketmakerName);
                download.on('end', (output) => {
                  exec(`chmod +x ${HOME}${marketmakerName}`,(err,stdout,stderr) => {
                    this.setState({ downloadComplete: true });
                  });
                });
             }else{
                 this.setState({ downloadComplete: true });
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
  _onDownload = (path, resolve) => {
      if(this.state.downloadComplete){
        resolve();
        this.props.history.push('/'+path);
      }else{
        setTimeout(()=>{ this._onDownload(path, resolve) },1000);
      }
  }
  render() {
    return (
      <div className={styles.container}>
        <AppLogo />
        <Paper className={styles.homeButtons}>
            <AButton color="accent" raised onClick={()=>{
              return new Promise((resolve, reject) => {
                 setTimeout(()=>{ this._onDownload("login",resolve) },500)
              })
            }}
            >Login</AButton>
           <AButton color="primary" raised onClick={()=>{
              return new Promise((resolve, reject) => {
                setTimeout(()=>{ this._onDownload("register",resolve) },500)
              })
            }}>Register</AButton>
        </Paper>
        {/*
           <Button color="accent" onClick={()=>{
              this.stopMarketmaker();
            }}>Stop Marketmaker</Button>
          */}
      </div>
    );
  }
}
export default Home;