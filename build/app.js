'use strict';

var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

var app = express();

app.use(logger('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(expressValidator({
  errorFormatter: function errorFormatter(param, msg, value) {
    var namespace = param.split('.');
    var root = namespace.shift();
    var formParam = root;
    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Require our routes into the application.
require('./route')(app);

app.get('*', function (req, res) {
  return res.status(200).send({
    message: 'Welcome to the beginning of nothingness.'
  });
});

module.exports = app;