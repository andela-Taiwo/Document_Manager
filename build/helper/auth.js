'use strict';

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jwt = require('jsonwebtoken');
_dotenv2.default.config();
var SECRET_KEY = process.env.SECRET;
console.log(SECRET_KEY);
module.exports = {
  setUserToken: function setUserToken(user) {
    var userToken = jwt.sign({
      user: user }, process.env.SECRET, { expiresIn: '12h' });
    return userToken;
  },
  authorize: function authorize(req, res, next) {
    var auth = req.headers.authorization;
    var token = req.body.token || req.headers['x-access-token'] || auth;
    if (token) {
      jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) {
          return res.status(403).send(err);
        }
        req.decoded = decoded;
        return next();
      });
    } else {
      res.status(412).send('Token not provided');
    }
  }
};