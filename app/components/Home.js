// @flow
import React, { Component } from 'react';
import styles from './Login.css';
import { HOME, marketmakerExe, coinsJSON } from '../utils/constants.js';
import { Icon, Button } from 'material-ui';
import wget from 'wget-improved';
import { exec } from 'child_process';
import { inject, observer } from 'mobx-react';
import fs from 'fs';
import AppLogo from './AppLogo';

@inject('HomeStore') @observer
class Home extends React.Component {
  constructor(props){
  	super(props);
  } 
  componentDidMount(){
    exec(`mkdir ${HOME}`,(err,stdout,stderr)=>{
      this.afterHomeDir();
    });
    exec(`pkill -15 marketmaker`);
    clearInterval(this.props.HomeStore.intervalTimer);
    this.props.HomeStore.intervalTimer = null;
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
        <div className={styles.homeButtons}>
            <Button color="accent" raised onClick={()=>{
              this.props.history.push('/login');
            }}
            >Login</Button>
           <Button color="primary" raised onClick={()=>{
              this.props.history.push('/register');
            }}>Register</Button>
        </div>
      </div>
    );
  }
}
export default Home;