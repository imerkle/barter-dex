// @flow
import React, { Component } from 'react';
import styles from './Main.css';

export default class LoadingWaitText extends Component {
  constructor(props){
  	super(props);
  }	
  render() {
  	const { text } = this.props;
	return (
		<div className={styles.loadingBar}>
			<div className={styles.loadingBar_inner}></div>
		</div>
	);
  }
}


