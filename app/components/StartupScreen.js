// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Login.css';
import AppLogo from './AppLogo';
import LoadingWaitText from './LoadingWaitText';

import { exec, spawn } from 'child_process';
import { HOME, SCRIPT_NAME } from '../utils/constants';
import fs from 'fs';
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
      setTimeout(()=>{
        this.startClient();
        //this.getCoins()
      },2000);
  }
  startClient = () => {
    const { ROOT_DEX } = this.props.HomeStore;
    const mm = spawn(`./client`,[],{
      cwd: ROOT_DEX
    })
    mm.stdout.on('data', (data) => {
      const myRegexp = /userpass.\((\w*)\)/g;
      const match = myRegexp.exec(data);
      if(match && match[1]){
          const userpass = match[1];
          fs.readFile(`${HOME}${SCRIPT_NAME}`, 'utf8', (err,data) => {
            data = data.replace("[USERPASS]",userpass);
            data = data.replace("[ROOT_DEX]",ROOT_DEX);

            fs.writeFile(`${HOME}${SCRIPT_NAME}`,data, (err) => {
                exec(`
                  chmod +x ${HOME}${SCRIPT_NAME}
                  ${HOME}${SCRIPT_NAME}
                  `,(err,stdout,stderr)=>{
                    this.props.history.push("/coinSelection");
                })
              });
          });
      }      
    });
  }
  render() {
    return (
       <div className={styles.container}>
       		<AppLogo />
       		<LoadingWaitText text={this.state.err} />
       </div>
    );
  }
}
export default StartupScreen;

