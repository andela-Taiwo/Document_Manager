
import 'babel-polyfill';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import React from 'react';
import  { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { thunk } from 'redux-thunk';
import configureStore from './store/configureStore';
import routes from './routes';
import './styles/style.sass';

import '../../node_modules/toastr/build/toastr.min.css';

// Initialize store
const store = configureStore();


render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes}/>
  </Provider>, document.getElementById('app')
);
