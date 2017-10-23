// @flow
import React, { Component } from 'react';
import styles from './Main.css';
import { CircularProgress } from 'material-ui/Progress';


export default class LoadingWaitText extends Component {
  constructor(props){
  	super(props);
  }	
  render() {
  	const { text } = this.props;
	return (
    <div className={styles.loadingBox}>
		  <div className={styles.loadingText}>{text}</div>
     <CircularProgress color="accent" size={50} />
    </div>
	);
  }
}


