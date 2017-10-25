/**
 * Copyright (C) 2017 Menome Technologies Inc.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import store from './redux/Store';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory'

const history = createBrowserHistory()

ReactDOM.render(
  <Router history={history}>
    <Provider store={store}>
      <Switch>
        <Route path="/" component={App}/>
      </Switch>
    </Provider>
  </Router>, 
  document.getElementById('root')
);

registerServiceWorker();
