// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Login.css';
import AppLogo from './AppLogo';
import LoadingWaitText from './LoadingWaitText';

import { exec, } from 'child_process';
import { HOME, marketmakerExe } from '../utils/constants';
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
        this.props.HomeStore.runCommand('enable',{ coin: "" }).then((res) => {
            const { userpass, mypubkey } = res;
            this.props.HomeStore.userpass = userpass;
            this.props.HomeStore.mypubkey = mypubkey;
            this.props.HomeStore.runCommand('electrum',{ coin: "BTC","ipaddr":"136.243.45.140","port":50001 });
            this.props.HomeStore.runCommand('electrum',{ coin: "BTC","ipaddr":"173.212.225.176","port":50001 });
            this.props.HomeStore.runCommand('electrum',{ coin: "KMD","ipaddr":"136.243.45.140","port":50011 });
            this.props.HomeStore.runCommand('electrum',{ coin: "KMD","ipaddr":"173.212.225.176","port":50011 });
            this.props.HomeStore.runCommand('electrum',{ coin: "REVS","ipaddr":"173.212.225.176","port":50050 });
            this.props.HomeStore.runCommand('electrum',{ coin: "REVS","ipaddr":"136.243.45.140","port":50050 });

            this.props.history.push("/mainPage");
        }).catch((err) => {
            console.log(err);
            this.userpassTimer = setTimeout(()=>{
              this.saveUserpass();
            },5000)
        });
  }  
  startMarketmaker = () => {
    const { available_coins, passphrase, gui } = this.props.HomeStore;

    const options = JSON.stringify({
        gui: gui,
        client: 1,
        userhome: HOME,
        passphrase: passphrase,
        coins: available_coins,
    });
    exec(`${HOME}marketmaker '${options}'`,{cwd: HOME},(err,std,stde)=>{
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

