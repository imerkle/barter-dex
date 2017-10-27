// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Main.css';
import HeaderNav from './HeaderNav';

import { Paper, Typography } from 'material-ui';
import { observer, inject } from 'mobx-react';

import { withStyles } from 'material-ui/styles';
import { stylesY } from '../utils/constants';

@withStyles(stylesY)
@inject('HomeStore','DarkErrorStore')
@observer
 class DebugScreen extends Component {
  constructor(props){
  	super(props);
  }
  render() {
	 const { classes, HomeStore } = this.props;
   const { debuglist } = HomeStore;
    return (
       <div className={styles.container2}>
        <HeaderNav primary="debug" />
        <Paper className={styles.container2} style={{margin: "0 auto"}}>
           <Typography className={classes.AppSectionTypo} type="headline" component="h4">Console Debug</Typography>
            <div className={styles.debugboxcontainer}> 
              {debuglist.map( (o,i)=>{
                  return(
                    <div className={styles.debugbox} key={i}> 
                      <div className={styles.inputbox}>{JSON.stringify(o.input)}</div>
                      <div className={styles.outputbox}>{JSON.stringify(o.output)}</div>
                    </div> 
                  )
              })}
            </div> 
					</Paper>	
       </div>
    );
  }
}
export default DebugScreen;

