// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AppLogo  from './AppLogo';
import styles from './Login.css';

import { Button, TextField } from 'material-ui';

import bip39 from 'bip39';

import { inject, observer } from 'mobx-react';
import { generateQR } from '../utils/basic.js';

import fs from 'fs';

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
    const { ROOT_DEX } = this.props.HomeStore;
    const { DarkErrorStore } = this.props;
    //const cmd = 'echo "export userpass=\"`./inv | cut -d \"\\"\" -f 4`\""';
    this.props.HomeStore.passphrase = this.state.passphrase;

    if(this.state.passphrase != this.state.passphrase_rp){
      DarkErrorStore.alert("Repeat Passphrase do not match!");
      return false;
    }else{
      const data = `export passphrase="${this.state.passphrase}"`;
      fs.writeFile(`${ROOT_DEX}passphrase`,data,(err,res)=>{
            if(err) DarkErrorStore.alert(err);
            this.props.history.push("/startup");

      })
    }
  }
  render() {
    return (
      <div className={styles.container}>
         <AppLogo />
         <TextField
              value={this.state.passphrase}
              disabled
              multiline
              margin="normal"
                label="Passphrase"
                InputProps={{ placeholder: 'Passphrase' }}
            />
         <TextField
              value={this.state.passphrase_rp}
              multiline
              margin="normal"
                label="Passphrase Repeat"
                InputProps={{ placeholder: 'Passphrase Repeat' }}
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