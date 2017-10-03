/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route, hashHistory } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import LoginPage from './containers/LoginPage';
import PinPage from './containers/PinPage';
import RegisterPage from './containers/RegisterPage';
import StartupScreen from './components/StartupScreen';

export default () => (
  <App>
    <Switch>
      <Route path="/startup" component={StartupScreen} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/pin" component={PinPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/" component={HomePage} />
    </Switch>
  </App>
);
