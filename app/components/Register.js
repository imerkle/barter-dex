// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AppLogo  from './AppLogo';
import styles from './Login.css';
import styles2 from './Main.css';

import { Paper, IconButton, Icon, Button, TextField } from 'material-ui';

import bip39 from 'bip39';

import { inject, observer } from 'mobx-react';
import { generateQR } from '../utils/basic.js';
import {  CopyToClipboard } from 'react-copy-to-clipboard';
import cx from 'classnames';

@inject('HomeStore','DarkErrorStore')
@observer
class Register extends Component {
  constructor(props){
    super(props);

    this.state = {
      passphrase: "",
      passphrase_rp: "",
    };
  }
  componentDidMount(){
    this.generatePassPhrase();
  }
  generatePassPhrase = () => {
    const passphrase = bip39.generateMnemonic()
    generateQR(passphrase,"QR");
    this.setState({ passphrase, passphrase_rp: "" })    
  }
  _handleRegister = () => {
    const { DarkErrorStore } = this.props;
    //const cmd = 'echo "export userpass=\"`./inv | cut -d \"\\"\" -f 4`\""';
    this.props.HomeStore.passphrase = this.state.passphrase;

    if(this.state.passphrase != this.state.passphrase_rp.replace(/^\s+|\s+$/g, '')){
      DarkErrorStore.alert("Repeat Passphrase do not match!");
      return false;
    }else{
      this.props.HomeStore.passphrase = this.state.passphrase;
      this.props.history.push("/startup");
    }
  }
  render() {
    return (
      <div className={styles.container}>
         <AppLogo />
         <div className={styles2.container} style={{alignItems: "center"}}>
           <TextField
                value={this.state.passphrase}
                disabled
                multiline
                margin="normal"
                label="Passphrase"
                InputProps={{ placeholder: 'Passphrase' }}
                style={{flex: "1 1 auto"}}
              />
            <CopyToClipboard text={this.state.passphrase} >
              <IconButton><Icon>content_copy</Icon></IconButton>
            </CopyToClipboard>
          </div>
         <TextField
              value={this.state.passphrase_rp}
              multiline
              margin="normal"
                label="Passphrase Repeat"
                InputProps={{ placeholder: 'Passphrase Repeat' }}
                onKeyUp={(e)=>{ 
                  if (e.key === 'Enter') {
                    this._handleRegister();
                  }                  
                }}
                onChange={(e)=>{
                  this.setState({ passphrase_rp: e.target.value }); 
                }}
            />            
            <canvas id="QR" className={styles.canvas}></canvas>
            <Button color="accent" onClick={this.generatePassPhrase} >Regenerate</Button>
            <Button raised color="primary" onClick={this._handleRegister}>Create Wallet</Button>
      </div>
    );
  }
}

export default Register;