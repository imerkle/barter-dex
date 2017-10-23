// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Login.css';
import { TextField, Button, IconButton, Icon } from 'material-ui';
import AppLogo from './AppLogo';
import crypto from 'crypto';
import { range, shuffle } from '../utils/basic.js';
import { HOME, maxPinLength, algorithm } from '../utils/constants.js';
import { inject, observer } from 'mobx-react';
import fs from 'fs';
const A = shuffle(range(1,10));


@inject('HomeStore','DarkErrorStore') @observer
class PinConfirm extends Component {
  constructor(props){
    super(props);
    this.state = {
      pin: "",
      pw_visible: false,
      maxReached: false,
    }
  }
  _handleClick = (n) => {
    let { pin } = this.state;
    pin +=""+n;
    if(pin.length >= maxPinLength){
      this.setState({ maxReached: true });
      return false;
    }
    this.setState({ pin });
  }
  _reset = () => {
    this.setState({ 
      pin: "",
      maxReached: false,
    }) 
  }
  decryptPassphrase = () => {
    fs.readFile(`${HOME}encrypted_pass`,"utf8",(err, data)=>{
      if(err){ 
        DarkErrorStore.alert("Encrypted Passphrase Does not exists");
      }else{
        const decryp = crypto.createDecipher(algorithm, this.state.pin);
        let decrypted_pass = decryp.update(data, 'hex','utf8');
         decrypted_pass += decryp.final('utf8');
         this.props.HomeStore.passphrase = decrypted_pass;
         this.props.history.push("/startup");
      }
    })
  }
  render() {
    return (
       <div className={styles.container} data-tid="container">
          <AppLogo />
          <div className={styles.numpad}>
            {A.map((o,i)=>(<Button disabled={this.state.maxReached} key={i} raised color="accent"
              onClick={()=>this._handleClick(o)} >{o}</Button>))}
              <Button color="accent" onClick={this._reset}>Clear</Button>
          </div>
          <div className={styles.fbox}>
            <TextField fullWidth type={(this.state.pw_visible) ? "text": "password"} value={this.state.pin} disabled />
            <IconButton onClick={()=>{this.setState({ pw_visible: !this.state.pw_visible })}}><Icon>{(this.state.pw_visible) ? "visibility" : "visibility_off"}</Icon></IconButton>
          </div>
          <div className={styles.fbox + " " + styles.clm}>
            <Button color="primary" raised disabled={!this.state.maxReached} onClick={this.decryptPassphrase}>Login</Button>
          </div>
       </div>
    );
  }
}
export default PinConfirm;
