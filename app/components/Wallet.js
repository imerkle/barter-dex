// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Main.css';
import HeaderNav from './HeaderNav';
import cx from 'classnames';
import FlipMove from 'react-flip-move';

import { inject, observer, action } from 'mobx-react';
import { Typography, Paper, FormControlLabel ,Switch ,Button, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from 'material-ui';

import { withStyles } from 'material-ui/styles';
import { stylesY } from '../utils/constants';
import { generateQR, zeroGray, coinNameFromTicker } from '../utils/basic.js';
import AButton from './AButton';


const labelDisp = (label, val) => {
  return (
    <div className={styles.tr}>
      <div className={styles.label}>{label}</div>
      <div className={styles.labelval}>{val}</div>
     </div>
    )
}
@withStyles(stylesY)
@inject('HomeStore','DarkErrorStore') @observer
class Wallet extends Component {
  constructor(props){
  	super(props);

  	this.state = {
      coin: {},
      openDeposit: false,
      openWithdraw: false,
      withdrawAddress: "",
      withdrawValue: "",
      hideZero: false,
      isHidden: false,
  	};	
  }
  componentDidMount(){
    const { HomeStore } = this.props;
  }
  handleRequestCloseDeposit = () => {
    this.setState({ openDeposit: false });
  }
  handleRequestCloseWithdraw = () => {
    this.setState({ openWithdraw: false, withdrawAddress: "" });
  }   
  hideZeroBalance = () => {
    const { classes } = this.props;
    return (
            <FormControlLabel
              style={{padding: "0 30px"}}
                control={
                  <Switch
                    checked={this.state.hideZero}
                    onChange={(event, checked) => {
                      this.setState({ hideZero: checked }) 
                    }}
                 classes={{
                    checked: classes.checked,
                    bar: classes.bar,
                  }}                        
                  />
                }
                label={"Hide Zero Balances"}
              />       
      );    
  } 
  depositWalletDialog = () => {
    const { coin, openDeposit } = this.state;
    return(
        <Dialog open={openDeposit} onRequestClose={this.handleRequestCloseDeposit}>
          <DialogTitle>Deposit</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Deposit only {coin.coin} to this Address.
              <br />
              Note: You must have atleast two deposits in order to trade.
            </DialogContentText>
            <canvas id="QRW" className={styles.canvas}></canvas>                          
            <TextField
              autoFocus
              disabled
              margin="dense"
              label="Deposit Address"
              type="text"
              fullWidth
              value={coin.smartaddress}
            />
          </DialogContent>
          <DialogActions>
            <Button raised onClick={this.handleRequestCloseDeposit} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>  
    );
  }
  withdrawWalletDialog = () => {
    const { coin, openWithdraw, withdrawAddress, withdrawValue } = this.state;
    const { DarkErrorStore, HomeStore } = this.props;
    const fee = coin.txfee * 0.00000001;
    const maxbal = (coin.balance - fee).toFixed(HomeStore.maxdecimal);

    return(
        <Dialog open={openWithdraw} onRequestClose={this.handleRequestCloseWithdraw}>
          <DialogTitle>Withdraw</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Withdraw {coin.coin} to this Address 
              <span className={styles.hint} onClick={()=>{ this.setState({ withdrawValue: maxbal  }) }}> ( Max: { maxbal }) </span>
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label={`Withdraw Amount(${coin.coin})`}
              type="text"
              fullWidth
              value={withdrawValue}
              onChange={(e)=>{
                this.setState({ withdrawValue: e.target.value })
              }}
            />            
            <TextField
              autoFocus
              margin="dense"
              label="Withdraw Address"
              type="text"
              fullWidth
              value={withdrawAddress}
              onChange={(e)=>{
                this.setState({ withdrawAddress: e.target.value })
              }}
            />
          </DialogContent>
          <DialogActions>
            <AButton raised color="accent"
              onClick={()=>{
                return new Promise((resolve, reject) => {
                    HomeStore.runCommand("withdraw",{coin: coin.coin, outputs: [{ [withdrawAddress]: withdrawValue }] }).then((res)=>{                  
                        if(!res.complete){
                          DarkErrorStore.alert("Withdrawal not successful");
                        }else{
                          const txid = res.txid; 
                          const txhex = res.hex;
                          HomeStore.runCommand("sendrawtransaction",{coin: coin.coin, signedtx: txhex }).then((res)=>{
                            coin.balance  = coin.balance - withdrawValue;
                            DarkErrorStore.alert("Withdrawal completed successfully.\nYour Transaction ID: " + txid, true);
                            this.handleRequestCloseWithdraw();
                          });
                        }
                        resolve();
                    });
               });
              }}>
              Withdraw {coin.coin}
            </AButton>
            <Button raised onClick={this.handleRequestCloseWithdraw} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>  
    );
  }
  render() {
    const { HomeStore } = this.props;
    const { base, coins, maxdecimal } = HomeStore;
    const { coin, hideZero, inv,unspent, isHidden } = this.state;  
    const { classes } = this.props;
    return (
       <div className={styles.container2}>
       	 <HeaderNav primary="wallet" />
         {this.hideZeroBalance()}
         {this.depositWalletDialog()}
         {this.withdrawWalletDialog()}
         <Paper className={cx(styles.section, classes.AppSection, styles.w_bar)}>   
            <div className={cx(styles.tr, styles.section_header, classes.AppSectionHeader, classes.AppSectionTypo)}>
              <div className={cx(styles.oneDiv,styles.draw)}>Deposit/Withdraw</div>
              <div className={cx(styles.oneDiv,styles.coin)}>Coin</div>
              <div className={cx(styles.oneDiv,styles.name)}>Name</div>
              <div className={cx(styles.oneDiv,styles.price)}>Balance</div>
              <div className={cx(styles.oneDiv,styles.volume)}>On Orders</div>
              <div className={cx(styles.oneDiv,styles.change)}>{base.coin} Value</div>
            </div>
            <FlipMove duration={750} easing="ease-out">
              {Object.keys(coins).map((k,v)=>{
                const o = coins[k];
                if(hideZero && (!o.balance || o.balance == 0)){
                  return null;
                }
                const orders = o.orders || 0;
                const balance = o.balance || 0;
                const value = (o.coin == base.coin ) ? 1 * balance :  o.value || 0;
                return (
                <div key={o.coin}>
                  <div className={styles.tr} onClick={()=>{
                    if(coin.coin == o.coin) {
                      this.setState({ isHidden: !isHidden });
                      return false;
                    }

                    HomeStore.runCommand("listunspent",{coin: o.coin, address: o.smartaddress }).then((unspentres)=>{
                      HomeStore.runCommand("getutxos",{coin: o.coin }).then((utxores)=>{
                        console.log(utxores)
                      });
                      HomeStore.runCommand("inventory",{coin: o.coin }).then((invres)=>{
                        this.setState({ inv: invres, unspent: unspentres, coin: o })
                      });
                    });
                  }}>
                    <div className={cx(styles.oneDiv,styles.draw)}>
                    	<Button raised color="accent" 
                      onClick={()=>{
                        setTimeout(()=>{
                          generateQR(o.smartaddress,"QRW");
                        },500);
                        this.setState({ openDeposit:true, coin: o }); 
                      }}
                      >Deposit</Button>
                    	<Button raised color="primary"
                      onClick={()=>{
                        this.setState({ openWithdraw:true, coin: o, withdrawAddress: "" }); 
                      }}                      
                      >Withdraw</Button>
                    </div>
                    <div className={cx(styles.oneDiv,styles.coin)}>{o.coin}</div>
                    <div className={cx(styles.oneDiv,styles.name)}>{coinNameFromTicker(o.coin)}</div>
                    <div className={cx(styles.oneDiv,styles.price)}>{zeroGray((balance).toFixed(maxdecimal))}</div>
                    <div className={cx(styles.oneDiv,styles.volume)}>{zeroGray((orders).toFixed(maxdecimal))}</div>
                    <div className={cx(styles.oneDiv,styles.change)}>{zeroGray((value).toFixed(maxdecimal))}</div>
                  </div>
                    { (o.coin == coin.coin && inv && unspent) ? 
                      <div className={cx(styles.container, {
                        [styles.noHeight] : isHidden,
                      })}>
                      <div className={styles.col}>
                        <Typography className={cx(classes.AppSectionTypo)}>Inventory</Typography>
                        {inv.alice.map(o=>{
                          return (
                          <div className={styles.invdisp}>
                            {labelDisp("Address",o.address)}
                            {labelDisp("Value 1",o.value  * 0.00000001  + " " + coin.coin)}
                            {labelDisp("Value 2",o.value2 * 0.00000001  + " " + coin.coin)}
                            {labelDisp("Txid",o.txid)}
                            {labelDisp("Txid2",o.txid2)}
                          </div>
                          )
                        })}
                      </div>
                      <div className={styles.col}>
                        <Typography className={cx(classes.AppSectionTypo)}>Unspent Transactions {unspent.length} </Typography>
                        {unspent.map(o=>{
                          return (
                          <div className={styles.invdisp}>
                            {labelDisp("Tx Hash",o.tx_hash)}
                            {labelDisp("value", (parseFloat(o.value) * 0.00000001) +" "+coin.coin)}
                          </div>
                          )
                        })}
                      </div>

                      </div>
                      : ""
                    }
                  </div>
                )
                })}
             </FlipMove>                     
        </Paper>
       </div>
    );
  }
}
export default Wallet;