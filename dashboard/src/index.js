import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.css';  // Top-level antd style.
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import store from './redux/Store';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

ReactDOM.render( 
  <Router>
    <LocaleProvider locale={enUS}>
      <Provider store={store}>
        <Switch>
          <Route path="/" component={App}/>
        </Switch>
      </Provider>
    </LocaleProvider>
  </Router>,  
  document.getElementById('root')
);

registerServiceWorker();
