// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';

export default class Home extends Component {
  render() {
    return (
      <div className={styles.container} data-tid="container">
        <h2>Dex</h2>
        <Link to="/login">Start Decentralized Exchange</Link>
        <Link to="/register">Register</Link>
      </div>
    );
  }
}
