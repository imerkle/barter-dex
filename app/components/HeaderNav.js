
// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Main.css';
import cx from 'classnames';
import AppLogo  from './AppLogo';
import { Button } from 'material-ui';

export default class Home extends Component {
  render() {
    let { primary } = this.props;
    //replace with proptypes later
    if(!primary) primary = "settings";
    return (
        <div className={cx(styles.container, styles.nomargin)}>
      		<AppLogo />	
           <div className={cx(styles.nav)}>
            <Link to="/mainPage"><Button raised={(primary == "exchange")} color="accent">Exchange</Button></Link>
            <Link to="/wallet"><Button raised={(primary == "wallet")} color="accent" >Wallet</Button></Link>
            <Button color="accent" raised={(primary == "orders")}>Orders</Button>
            <Link to="/settings"><Button raised={(primary == "settings")} color="accent">Settings</Button></Link>
           </div>
        </div>
    );
  }
}

