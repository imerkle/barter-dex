// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Main.css';
import HeaderNav from './HeaderNav';

import { TextField, Paper, Typography, Button } from 'material-ui';
import { observer, inject } from 'mobx-react';

import { withStyles } from 'material-ui/styles';
import { stylesY } from '../utils/constants';
import AButton from './AButton';

@withStyles(stylesY)
@inject('HomeStore','DarkErrorStore')
@observer
 class DebugScreen extends Component {
  constructor(props){
  	super(props);
    this.state={
      params: [],
      method: "",
    }
  }
  render() {
	 const { classes, HomeStore } = this.props;
   const { debuglist, curlMain } = HomeStore;
   const { params } = this.state;
    return (
       <div className={styles.container2}>
        <HeaderNav primary="debug" />
        <Paper className={styles.container2} style={{margin: "20px"}}>
           <Typography className={classes.AppSectionTypo} type="headline" component="h4">Curl Tool</Typography>
            <div className={styles.padbox}>
                <TextField value={this.state.method} label="Method" placeholder="Method" onChange={(e)=>{
                    this.setState({ method: e.target.value })
                }} />
               {params.map( (o,i)=>{
                  const placeholder = `Key ${i+1}`;
                  const placeholder2 = `Value ${i+1}`;
                  return (
                      <div className={styles.container} key={i}>
                        <TextField value={o.key} label={placeholder} placeholder={placeholder} onChange={(e)=>{
                            params[i].key = e.target.value;
                            this.setState({ params })
                        }} />
                        <TextField value={o.value} label={placeholder2} placeholder={placeholder2} onChange={(e)=>{
                            params[i].value = e.target.value;
                            this.setState({ params })
                        }} />
                      </div>
                  )
               })} 
               <Button color="primary" onClick={()=>{
                    params.push({key:"",value:""})
                    this.setState({ params })
               }}>Add Param</Button>
               <AButton raised color="accent" onClick={()=>{
                  return new Promise((resolve, reject) => {
                      HomeStore.doMainRequest(this.state.method,this.state.params,resolve);
                  });
               }}>Send</AButton>

               {(curlMain && curlMain.input) ?  
                <div className={styles.debugbox}> 
                  <div className={styles.inputbox}>{JSON.stringify(curlMain.input)}</div>
                  <div className={styles.outputbox}>{JSON.stringify(curlMain.output)}</div>
                </div> : ""
              }

            </div>
        </Paper>
        <Paper className={styles.container2} style={{margin: "20px"}}>
           <Typography className={classes.AppSectionTypo} type="headline" component="h4">Console Debug
           <Button color="accent" onClick={()=>{
            this.props.HomeStore.setValue("debuglist",[]);
           }}>Clear</Button>
           </Typography>
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

