// @flow
import React from 'react';
import Routes from '../routes';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import history from '../history.js';
import { Router } from 'react-router'
import fs from 'fs';
import { HOME } from '../utils/constants.js';
class BrowserRouter2 extends React.Component {
  render() {
    return <Router history={history} children={this.props.children}/>
  }
}

/*
const theme = 
  {
    palette: {
      type: 'dark',
    },
    AppBg: '#7bbb15',
    AppSectionBg: "rgba(28, 33, 66, 0.25)",
    AppSectionHeaderBg: "#175d42",
    RootColor: '#FFF',
    AppBgImageHeight: "750px",
};
*/
const theme = 
  {
    palette: {
      type: 'light',
      type: 'dark',
      secondary:{
        50: '#e2f7ea',
        100: '#b8ebca',
        200: '#88dda7',
        300: '#58cf84',
        400: '#35c569',
        500: '#11bb4f',
        600: '#0fb548',
        700: '#0cac3f',
        800: '#0aa436',
        900: '#059626',
        A100: '#c2ffcc',
        A200: '#8fffa2',
        A400: '#5cff77',
        A700: '#42ff62',
        'contrastDefaultColor': 'light',
      },
      primary: {
        50: '#fdeae0',
        100: '#f9cbb3',
        200: '#f6a980',
        300: '#f2874d',
        400: '#ef6d26',
        500: '#ec5300',
        600: '#ea4c00',
        700: '#e74200',
        800: '#e43900',
        900: '#df2900',
        A100: '#ffffff',
        A200: '#ffd8d3',
        A400: '#ffaca0',
        A700: '#ff9586',
        'contrastDefaultColor': 'light',    
      }
    },
    AppBg: '#fbbf40',
    AppBg: '#6b6b6b',
    /*AppSectionBg: "#FFF",*/
    AppSectionHeaderBg: "#175d42",
    RootColor: '#333',
    RootColor: '#FFF',
    AppBgImageHeight: "660px",
    AppSectionTypoBg: "#f9f9f9",
    AppSectionTypoColor: "#868686",
    AppSectionTypoBg: "rgba(0, 0, 0, 0.2)",
    AppSectionTypoColor: "#FFF",
};

class Root extends React.Component{
  constructor(props){
    super(props);

    let customTheme = {};
    fs.readFile(`${HOME}theme.json`,'utf8',(err, data)=>{
      if(!err){
        customTheme = JSON.parse(data);
        const new_theme = {
          ...theme,
          ...customTheme
        };
        this.setState({ theme: createMuiTheme(new_theme) }); 
      }
    });

    this.state = {
      theme: createMuiTheme(theme),
    };
  }
  render(){
    return (
    <BrowserRouter2 onUpdate={() => window.scrollTo(0, 0)}>
        <MuiThemeProvider theme={this.state.theme}>
         	<Routes />
        </MuiThemeProvider>	
    </BrowserRouter2>
    );
  }
}
export default Root;
