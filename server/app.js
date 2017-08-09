
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const app = express();

app.use(logger('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
    const namespace = param.split('.');
    const root = namespace.shift();
    let formParam = root;
    while (namespace.length) {
      formParam += `[${namespace.shift()}]`;
    }
    return {
      param: formParam,
      msg,
      value
    };
  }
}));

// Require our routes into the application.
require('./route')(app);

app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.',
}));

module.exports = app;
