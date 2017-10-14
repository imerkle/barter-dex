// @flow
import React from 'react';
import Routes from '../routes';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import history from '../history.js';
import { Router } from 'react-router'

const theme = createMuiTheme({
  palette: {
  	type: 'dark',
  },
});


class BrowserRouter2 extends React.Component {
  render() {
    return <Router history={history} children={this.props.children}/>
  }
}


export default function Root() {
  return (
   <BrowserRouter2 onUpdate={() => window.scrollTo(0, 0)}>
      <MuiThemeProvider theme={theme}>
       	<Routes />
      </MuiThemeProvider>	
   </BrowserRouter2>
  );
}
