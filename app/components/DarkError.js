import React, { Component } from 'react';
import styles from './Main.css';
import { inject, observer } from 'mobx-react';
import cx from 'classnames';

@inject('DarkErrorStore') @observer
class DarkError extends React.Component {

	_hideError = () => {
		const { DarkErrorStore } = this.props;
		DarkErrorStore.visible = false;
	}
	render(){
		const { DarkErrorStore } = this.props;

		if(!DarkErrorStore.visible){
			return (null);
		}
		return (
			<div className={cx(styles.error_overlay)} onClick={this._hideError}>

			<div className={cx(styles.error_small,
				{[styles.no_error]: DarkErrorStore.good}
				)}>
				<div className={styles.error_header} >{(DarkErrorStore.good)? "Success!" : "Oops!"}</div>
				<div className={styles.error_text}>{DarkErrorStore.text}</div>
			</div>
				
			</div>
		);
	}
}
export default DarkError;