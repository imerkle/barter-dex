
// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Main.css';
import cx from 'classnames';
import AppLogo  from './AppLogo';
import { Button } from 'material-ui';

export default class Home extends Component {
  render() {
    return (
        <div className={cx(styles.container, styles.nomargin)}>
      		<AppLogo />	
           <div className={cx(styles.nav)}>
            <Link to="/mainPage"><Button raised color="accent">Exchange</Button></Link>
            <Button color="accent" >Wallet</Button>
            <Button color="accent">Orders</Button>
            <Link to="/settings"><Button color="accent">Settings</Button></Link>
           </div>
        </div>
    );
  }
}

