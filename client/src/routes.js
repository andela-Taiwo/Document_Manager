import React from 'react';
import { Link, Route, IndexRoute } from 'react-router';
import App from './components/App';
import HomePage from './components/HomePage.jsx';
import Dashboard from './components/dashboard/Dashboard.jsx';
import AllDocuments from './components/documents/Documents.jsx';
import DocumentContent from './components/documents/DocumentContent.jsx'

export default(
  <Route path="/" component={App} >
    <IndexRoute component={HomePage} />
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/dashboard/:documents" component={AllDocuments} />
    <Route exact path="/dashboard/:document/:id" component={DocumentContent} />
  </Route>
);
