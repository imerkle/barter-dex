// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AppLogo  from './AppLogo';
import styles from './Login.css';

import { Button, TextField } from 'material-ui';

import bip39 from 'bip39';

import { exec } from 'child_process';
import { inject, observer } from 'mobx-react';
import { generateQR } from '../utils/basic.js';

@inject('HomeStore')
@observer
class Register extends Component {
  constructor(props){
    super(props);

    this.state = {
      passphrase: "",
    };
  }
  componentDidMount(){
    this.generatePassPhrase();
  }
  generatePassPhrase = () => {
    const passphrase = bip39.generateMnemonic()
    generateQR(passphrase,"QR");
    this.setState({ passphrase })    
  }

  _handleRegister = () => {
    const { ROOT_DEX } = this.props.HomeStore;
    const cmd = 'echo "export userpass=\"`./inv | cut -d \"\\"\" -f 4`\""';
    this.props.HomeStore.passphrase = this.state.passphrase;
    exec(`
          cd ${ROOT_DEX}
          echo "export passphrase=\"${this.state.passphrase}\"" > passphrase 
    `,(err, stdout, stderr)=>{
        if(err) alert(err);
        this.props.history.push("/startup");
    });
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
            <canvas id="QR" className={styles.canvas}></canvas>
            <Button color="accent" onClick={this.generatePassPhrase} >Regenerate</Button>
            <Button raised color="primary" onClick={this._handleRegister}>Create Wallet</Button>      
      </div>
    );
  }
}

export default Register;