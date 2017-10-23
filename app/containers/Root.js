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

const theme = 
  {
    palette: {
      type: 'dark',
    },
    AppBg: '#7bbb15',
    AppSectionBg: "rgba(28, 33, 66, 0.25)",
    AppSectionHeaderBg: "#175d42",
    RootColor: '#FFF',
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
