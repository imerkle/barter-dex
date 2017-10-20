// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Main.css';
import HeaderNav from './HeaderNav';

import { Button, Typography } from 'material-ui';


import { observer, inject } from 'mobx-react';


@inject('HomeStore','DarkErrorStore')
@observer
 class BaseSelection extends Component {
  constructor(props){
  	super(props);
  }
  render() {
	 const { classes, HomeStore } = this.props;
   const { base, coins } = HomeStore;
    return (
       <div className={styles.container2}>
        <HeaderNav />
        <div className={styles.container2} style={{margin: "0 auto",padding: "0px 170px"}}>
           <Typography type="headline" component="h4">Change Base Coin ( Current {base.coin} )</Typography>
            <div className={styles.container_buttons}>
              {Object.keys(coins).map((k,v)=>{
                return(<Button raised={(base.coin == k)} color="accent" onClick={()=>{
                  this.props.HomeStore.base.coin = k;
                }}>{k}</Button>)
              })}
            </div>  
					</div>	
       </div>
    );
  }
}
export default BaseSelection;

