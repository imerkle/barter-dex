// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Login.css';
import { ROOT_DEX, HOME, userpassscript, SCRIPT_NAME } from '../utils/constants.js';
import { TextField } from 'material-ui';
import wget from 'wget-improved';
import { exec } from 'child_process';

export default class Home extends Component {
  constructor(props){
  	super(props);
  	this.state = {
  		ROOT_DEX: ROOT_DEX
  	};
  }	
  componentDidMount(){
  	const ROOT_DEX = localStorage.getItem("ROOT_DEX");
  	if(ROOT_DEX) this.setState({ ROOT_DEX });
	wget.download(userpassscript, HOME+SCRIPT_NAME);
  
    exec(`
    	pkill -15 marketmaker
    	rm ${ROOT_DEX}passphrase || true
    	rm ${ROOT_DEX}userpass || true
    `,(err, stdout, stderr)=>{
    	//if(err) alert(err);
    });	


  }
  render() {
    return (
      <div className={styles.container}>
        <h2>Dex</h2>
        <Link to="/login">Start Decentralized Exchange</Link>
        <br />
        <Link to="/register">Register</Link>
        <br />
        <br />
        <TextField value={this.state.ROOT_DEX} onChange={(e)=>{
        	const ROOT_DEX = e.target.value;
        	this.setState({ ROOT_DEX: ROOT_DEX });
        	localStorage.setItem("ROOT_DEX", ROOT_DEX)
        }}/>
      </div>
    );
  }
}
