// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Main.css';
import HeaderNav from './HeaderNav';
import cx from 'classnames';
import FlipMove from 'react-flip-move';
import shell from 'shelljs';

import { FormControlLabel ,Switch ,Button, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from 'material-ui';

import { withStyles } from 'material-ui/styles';
import { inject, observer } from 'mobx-react';
import { stylesX } from '../utils/constants';
import { generateQR } from '../utils/basic';


const mockWallet = [
{
	coin: "KMD",
	name: "Komodo" ,
	balance: 50,
	orders: 200,
	value: .5,
}
];

@withStyles(stylesX)
@inject('HomeStore') @observer
class Wallet extends Component {
  constructor(props){
  	super(props);

  	this.state = {
      coin: {},
      openDeposit: false,
      openWithdraw: false,
      withdrawAddress: "",
      hideZero: false,
  	};	
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
    const { coin, openWithdraw, withdrawAddress } = this.state;
    return(
        <Dialog open={openWithdraw} onRequestClose={this.handleRequestCloseWithdraw}>
          <DialogTitle>Withdraw</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Withdraw {coin.coin} to this Address.
            </DialogContentText>
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
            <Button raised color="accent">
              Withdraw {coin.coin}
            </Button>
            <Button raised onClick={this.handleRequestCloseWithdraw} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>  
    );
  }  
  render() {
    const { base, coins } = this.props.HomeStore;
    const { hideZero } = this.state;
    return (
       <div className={styles.container2}>
       	 <HeaderNav />
         {this.hideZeroBalance()}
         {this.depositWalletDialog()}
         {this.withdrawWalletDialog()}
         <div className={cx(styles.section, styles.w_bar)}>   
            <div className={cx(styles.tr, styles.section_header)}>
              <div className={cx(styles.oneDiv,styles.draw)}>Deposit/Withdraw</div>
              <div className={cx(styles.oneDiv,styles.coin)}>Coin</div>
              <div className={cx(styles.oneDiv,styles.name)}>Name</div>
              <div className={cx(styles.oneDiv,styles.price)}>Balance</div>
              <div className={cx(styles.oneDiv,styles.volume)}>On Orders</div>
              <div className={cx(styles.oneDiv,styles.change)}>{base.coin} Value</div>
            </div>
            <FlipMove duration={750} easing="ease-out" style={{padding: "10px"}}>
              {Object.keys(coins).map((k,v)=>{
                const o = coins[k];
                if(hideZero && (!o.balance || o.balance == 0)){
                  return null;
                }
                return (
                  <div className={styles.tr} key={o.coin}>
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
                    <div className={cx(styles.oneDiv,styles.name)}>{o.name}</div>
                    <div className={cx(styles.oneDiv,styles.price)}>{o.balance}</div>
                    <div className={cx(styles.oneDiv,styles.volume)}>{o.orders}</div>
                    <div className={cx(styles.oneDiv,styles.change)}>{o.value}</div>
                  </div>
                )
                })}
             </FlipMove>                     
        </div>
       </div>
    );
  }
}
export default Wallet;