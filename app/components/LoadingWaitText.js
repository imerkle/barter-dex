// @flow
import React, { Component } from 'react';
//import styles from './Login.css';

export default class LoadingWaitText extends Component {
  constructor(props){
  	super(props);
  }	
  render() {
  	const { text } = this.props;
	return (
		<div>{text}</div>
	);
  }
}


