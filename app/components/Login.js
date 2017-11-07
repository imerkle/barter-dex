// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Login.css';

import { Icon, Button, TextField} from 'material-ui';

import AppLogo from './AppLogo';

import { exec } from 'child_process';
import { observer, inject } from 'mobx-react';
import { makeButton } from '../utils/basic.js';


@inject('HomeStore','DarkErrorStore')
@observer
class Login extends Component {
  constructor(props){
   super(props)
  }
  _handleChange = (e) => {
    this.props.HomeStore.passphrase = e.target.value;
  }
  _handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      this._handleLogin();
    }    
  }
  _handleLogin = () => {
  	this.props.history.push("/startup");
  }
   _handleSave = () => {
  	if(this.props.HomeStore.passphrase.length < 1){
  		this.props.DarkErrorStore.alert("Enter a Passphrase to Login");
  	}
  	this.props.history.push("/pin");
  }
  render() {
    const { passphrase }  = this.props.HomeStore;
    return (
        <div className={styles.container}>      
        <AppLogo />
		    <TextField
		          value={passphrase}
              onChange={this._handleChange}
		          onKeyUp={this._handleKeyUp}
		          margin="normal"
          		  label="Passphrase"
          		  InputProps={{ placeholder: 'Passphrase' }}		          
		        />
				{/*          
            <Button color="accent" onClick={this._handleSave}>Save Passphrase</Button>
		        <Button raised color="accent" onClick={()=>{
              this.props.history.push("/pinConfirm")
            }}>Login with Pin</Button>		
			*/}
			
            
          
		        <Button disabled={(passphrase.length==0)} raised color="primary" onClick={this._handleLogin}>
              {makeButton("Login","call_missed_outgoing")}
            </Button>

            <div className={styles.shinelink}>
              <Link to={"/register"}>Don't have a passphrase ?</Link>
            </div>
        </div>
    );
  }
}
export default Login;