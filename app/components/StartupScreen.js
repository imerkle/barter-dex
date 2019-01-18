// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Login.css';
import AppLogo from './AppLogo';
import LoadingWaitText from './LoadingWaitText';

import { exec, } from 'child_process';
import { UHOME,HOME, marketmakerName, marketmakerExe, electrumIP, electrumPorts, platform } from '../utils/constants';
import { observer, inject } from 'mobx-react';


 const timeoutSec = 4000;

 @inject('HomeStore')
 @observer
 class StartupScreen extends Component {
  constructor(props){
  	super(props);

  	this.state = {
  		err: "Running Client Please Wait",
  	};
  }
  componentDidMount(){
      //let state heat up
      this.props.HomeStore.isRunning().then((inUse)=>{
        if(!inUse){
          this.startMarketmaker();
          this.userpassTimer = setTimeout(()=>{
            this.saveUserpass();
          },60000)
        }else{
          this.saveUserpass();
        }
      })
  }
  componentWillUnmount(){
    clearTimeout(this.userpassTimer);
    this.userpassTimer = null;
  }
   saveUserpass = () => {
    const { HomeStore } = this.props;
          HomeStore.runCommand('enable',{ coin: "" }).then((res) => {
            const { userpass, mypubkey } = res;

            HomeStore.setUserpass(userpass, mypubkey);

              HomeStore.enabled_coins.map(o=>{
                const method = ( electrumPorts[o] ) ? "electrum" : "";
                  HomeStore.runCommand('enable',{ coin: o}).then((res)=>{
                    if(res.error){
                        electrumIP.map(ox=>{
                          HomeStore.runCommand(method,{ coin: o, ipaddr: ox, port: electrumPorts[o] });
                        })
                      }
                  });
              });
              if(HomeStore.enabled_coins[0] && HomeStore.enabled_coins[1]){
                HomeStore.base = {coin: HomeStore.enabled_coins[0], balance: 0};
                HomeStore.currentCoin = {coin: HomeStore.enabled_coins[1], balance: 0};
              }else if (HomeStore.enabled_coins[0]){
                HomeStore.base = {coin: HomeStore.enabled_coins[0], balance: 0};
              }
              

            this.props.history.push("/coinSelection");
        }).catch((err) => {
            this.userpassTimer = setTimeout(()=>{
              this.saveUserpass();
            },5000)
        });
  }  
  startMarketmaker = () => {
    const { available_coins, passphrase, gui } = this.props.HomeStore;

    let options = {
        gui: gui,
        client: 1,
        userhome: UHOME,
        passphrase: passphrase,
    };

    if (platform !== 'win32') {
        options.coins = available_coins;
        options = JSON.stringify(options);
        options = `'${options}'`;
    } else {
        options = JSON.stringify(options);
        options = options.replace(/"/g, '\\"')
    }
    exec(`${HOME}${marketmakerName} ${options}`,{cwd: HOME},(err,std,stde)=>{
      //console.log(err);
      //console.log(std);
      //console.log(stde);
    });
  }
  render() {
    return (
       <div className={styles.container}>
       		<AppLogo />
       		<LoadingWaitText text="Initiating Marketmaker" />
       </div>
    );
  }
}
export default StartupScreen;

