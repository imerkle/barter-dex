// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Main.css';
import HeaderNav from './HeaderNav';
import cx from 'classnames';
import FlipMove from 'react-flip-move';

import { inject, observer, action } from 'mobx-react';
import { IconButton, Icon, Typography, Paper, FormControlLabel ,Switch ,Button, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from 'material-ui';

import { withStyles } from 'material-ui/styles';
import { stylesY } from '../utils/constants';
import { generateQR, zeroGray, coinNameFromTicker } from '../utils/basic.js';
import AButton from './AButton';
import LoadingWaitText from './LoadingWaitText';
import {  CopyToClipboard } from 'react-copy-to-clipboard';

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
      inventory: {},
      listunspent: [],
  	};	
  }
  componentDidMount(){
    const { HomeStore } = this.props;
  }
  componentWillUnmount(){
    this.stopTimer();
  }
  startTimer = () => {
    const { coins } = this.props.HomeStore;
    const coinTicker = this.state.coin.coin;

    this.thetimer = setTimeout(()=>{
      if(coinTicker && coins[coinTicker].inventory){
        this.setState({ inventory: coins[coinTicker].inventory })
      }else if(coinTicker && coins[coinTicker].listunspent){
        this.setState({ listunspent: coins[coinTicker].listunspent })
      }else{ 
        this.startTimer();
      }
    },1000);
  }
  stopTimer = () => {
    clearTimeout(this.thetimer);
    this.thetimer = null;
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
            <div className={styles.container}>
            <TextField
              autoFocus
              disabled
              margin="dense"
              label="Deposit Address"
              type="text"
              fullWidth
              value={coin.smartaddress}
            />



        <CopyToClipboard text={coin.smartaddress} >
            <IconButton onClick={(e)=>{
              
            }}><Icon>content_copy</Icon></IconButton>
        </CopyToClipboard>


            </div>

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
    const { coin, hideZero, isHidden, inventory, listunspent } = this.state;  
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
              {/*<div className={cx(styles.oneDiv,styles.volume)}>On Orders</div>*/}
              <div className={cx(styles.oneDiv,styles.change)}>{base.coin} Value</div>
            </div>
            <FlipMove duration={750} easing="ease-out">
              {Object.keys(coins).map((k,v)=>{
                const o = coins[k];
                if(hideZero && (!o.balance || o.balance == 0)){
                  return null;
                }
                //const orders = o.orders || 0;
                const balance = o.balance || 0;
                const value = (o.coin == base.coin ) ? 1 * balance :  o.value || 0;
                return (
                <div key={o.coin}>
                  <div className={styles.tr} onClick={()=>{
                    if(coin.coin == o.coin) {
                      this.setState({ isHidden: !isHidden });
                      return false;
                    }
                    HomeStore.setInventory(o.coin);
                    HomeStore.setListUnspent(o.coin, o.smartaddress); 
                    this.startTimer();
                    this.setState({coin: o }); 

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
                    {/*<div className={cx(styles.oneDiv,styles.volume)}>{zeroGray((orders).toFixed(maxdecimal))}</div>*/}
                    <div className={cx(styles.oneDiv,styles.change)}>{zeroGray((value).toFixed(maxdecimal))}</div>
                  </div>
                    { (o.coin == coin.coin ) ? 
                      <div className={cx(styles.container, {
                        [styles.noHeight] : isHidden,
                      })}>
                      <div className={styles.col}>
                        <Typography className={cx(classes.AppSectionTypo)}>Inventory</Typography>
                        {(inventory && inventory.alice) ? inventory.alice.map((o,i)=>{
                          return (
                          <div className={styles.invdisp} key={i}>
                            {labelDisp("Address",o.address)}
                            {labelDisp("Value 1",o.value  * 0.00000001  + " " + coin.coin)}
                            {labelDisp("Value 2",o.value2 * 0.00000001  + " " + coin.coin)}
                            {labelDisp("Txid",o.txid)}
                            {labelDisp("Txid2",o.txid2)}
                          </div>
                          )
                        }) : <LoadingWaitText text={"Generating Inventory"} />}
                      </div>
                      <div className={styles.col}>
                        <Typography className={cx(classes.AppSectionTypo)}>Unspent Transactions {(listunspent) ? listunspent.length : ""} </Typography>
                        {(listunspent) ? listunspent.map((o,i)=>{
                          return (
                          <div className={styles.invdisp} key={i}>
                            {labelDisp("Tx Hash",o.tx_hash)}
                            {labelDisp("value", (parseFloat(o.value) * 0.00000001) +" "+coin.coin)}
                          </div>
                          )
                        }) : <LoadingWaitText text={"Generating Unspent Transactions"} /> }
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