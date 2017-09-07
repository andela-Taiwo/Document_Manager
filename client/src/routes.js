import React from 'react';
import { Link, Route, IndexRoute } from 'react-router';
import App from './components/App';
import HomePage from './components/HomePage.jsx';

export default(
  <Route path="/" component={App} >
    <IndexRoute component={HomePage} />
  </Route>
);
