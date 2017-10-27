/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import { Provider } from 'mobx-react';
import { withRouter } from 'react-router';

import DarkError from './components/DarkError';
import Home from './components/Home';
import Login from './components/Login';
import Pin from './components/Pin';
import PinConfirm from './components/PinConfirm';
import Register from './components/Register';
import StartupScreen from './components/StartupScreen';
import MainPage from './components/MainPage';
import Settings from './components/Settings';
import Wallet from './components/Wallet';
import CoinSelection from './components/CoinSelection';
import BaseSelection from './components/BaseSelection';
import IndicatorSelection from './components/IndicatorSelection';
import DebugScreen from './components/DebugScreen';

import HomeStore from './store/HomeStore.js';
import DarkErrorStore from './store/DarkErrorStore.js';

import { withStyles } from 'material-ui/styles';
import { stylesY } from './utils/constants';

const stores = { 
  HomeStore,
  DarkErrorStore,
};

const MainRoutes = () => (
     <main>
      <Switch>
        <Route path="/debug" component={DebugScreen} />
        <Route path="/indicatorSelection" component={IndicatorSelection} />
        <Route path="/baseSelection" component={BaseSelection} />
        <Route path="/coinSelection" component={CoinSelection} />
        <Route path="/wallet" component={Wallet} />
        <Route path="/settings" component={Settings} />
        <Route path="/mainPage" component={MainPage} />
        <Route path="/startup" component={StartupScreen} />
        <Route path="/register" component={Register} />
        <Route path="/pinConfirm" component={PinConfirm} />
        <Route path="/pin" component={Pin} />
        <Route path="/login" component={Login} />
        <Route path="/" component={Home} />
      </Switch>
    </main>  
);

@withStyles(stylesY)
class AppMain extends React.Component {
  render(){
    const { classes } = this.props;
    return (
       <Provider {...stores}>
          <div className={classes.root}>
            <MainRoutes />
            <DarkError />
            <div className={classes.AppBg}>
              <img className={classes.AppBgImage} src="https://i.imgur.com/MLOlV1Y.png" />
            </div>
          </div>
        </Provider>
      );
  }
}

@withRouter
class App extends React.Component {
  render(){
    return (<div><AppMain /></div>)
  }
}
export default App;

