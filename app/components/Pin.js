// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Login.css';
import { TextField, Button, IconButton, Icon } from 'material-ui';
import AppLogo from './AppLogo';
import crypto from 'crypto';
import { maxPinLength, range, shuffle } from '../utils/basic.js';


const A = shuffle(range(1,10));
export default class Pin extends Component {
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
  encryptPassphrase = () => {
    const encrypted_pass = crypto.createHmac('sha256', this.state.pin)
                   .update(localStorage.getItem("passphrase"))
                   .digest('hex');
    localStorage.setItem("passphrase", encrypted_pass);
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
            <Button color="primary" raised disabled={!this.state.maxReached} onClick={this.encryptPassphrase}>Next</Button>
          </div>
       </div>
    );
  }
}
