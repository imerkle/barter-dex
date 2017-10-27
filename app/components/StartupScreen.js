// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Login.css';
import AppLogo from './AppLogo';
import LoadingWaitText from './LoadingWaitText';

import { exec, } from 'child_process';
import { HOME, marketmakerExe, electrumIP, electrumPorts } from '../utils/constants';
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
                HomeStore.runCommand('enable',{ coin: o}).then((res)=>{
                   if(res.error){
                      //DarkErrorStore.alert(res.error);
                      if(electrumPorts[o]){
                        HomeStore.runCommand('electrum',{ coin: o, ipaddr: electrumIP,port: electrumPorts[o] },(res)=>{
                        });
                      }
                   }
                });
              });

            this.props.history.push("/coinSelection");
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
      console.log(err);
      console.log(std);
      console.log(stde);
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

