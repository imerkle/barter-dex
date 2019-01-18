// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Main.css';
import cx from 'classnames';
import AppLogo  from './AppLogo';
import { Icon, Button } from 'material-ui';
import { makeButton } from '../utils/basic.js';

export default class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      wrapOpen: false,
    }
  }
  render() {
    let { primary } = this.props;
    let { wrapOpen } = this.state;
    //replace with proptypes later
    if(!primary) primary = "settings";
    return (
        <div className={cx(styles.container, styles.nomargin)}>
      		<AppLogo />	
           <div className={cx(styles.nav)}>
            <Link to="/shapeShift"><Button raised={(primary == "exchange")} color="accent">{makeButton("Exchange","swap_calls", true)}</Button></Link>
            <Link to="/wallet"><Button raised={(primary == "wallet")} color="accent" >{makeButton("Wallet","account_balance_wallet", true)}</Button></Link>
            <Link to="/orders"><Button raised={(primary == "orders")} color="accent">{makeButton("Orders","featured_play_list", true)}</Button></Link>
            <Link to="/debug"><Button raised={(primary == "debug")} color="accent">{makeButton("Debug","code", true)}</Button></Link>
            <Link to="/settings"><Button raised={(primary == "settings")} color="accent">{makeButton("Settings","settings", true)}</Button></Link>
           </div>
        </div>
    );
  }
}

