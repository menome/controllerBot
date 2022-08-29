import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.css';  // Top-level antd style.
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import store from './redux/Store';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

ReactDOM.render( 
  <Router>
    <ConfigProvider locale={enUS}>
      <Provider store={store}>
        <Routes>
          <Route path="/" component={App}/>
        </Routes>
      </Provider>
    </ConfigProvider>
  </Router>,  
  document.getElementById('root')
);

registerServiceWorker();
