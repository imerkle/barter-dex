/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route, hashHistory } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import LoginPage from './containers/LoginPage';
import PinPage from './containers/PinPage';
import RegisterPage from './containers/RegisterPage';
import StartupScreen from './components/StartupScreen';
import MainPage from './components/MainPage';
import Settings from './components/Settings';
import Wallet from './components/Wallet';
import CoinSelection from './components/CoinSelection';

export default () => (
  <App>
    <Switch>
      <Route path="/coinSelection" component={CoinSelection} />
      <Route path="/wallet" component={Wallet} />
      <Route path="/settings" component={Settings} />
      <Route path="/mainPage" component={MainPage} />
      <Route path="/startup" component={StartupScreen} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/pin" component={PinPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/" component={HomePage} />
    </Switch>
  </App>
);
