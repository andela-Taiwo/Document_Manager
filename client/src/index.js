import React from 'react';
// import  { render } from 'react-dom';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
// import 'babel-polyfill';
import routes from './routes';
// import 'styles/style.sass';

ReactDOM.render(
  <Router history={browserHistory} routes={routes}/>, document.getElementById('app')
);
