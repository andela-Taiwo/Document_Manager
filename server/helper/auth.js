import dotenv from 'dotenv';
const jwt = require('jsonwebtoken');
dotenv.config();
const SECRET_KEY = process.env.SECRET;
console.log(SECRET_KEY);
module.exports = {
  setUserToken(user) {
    const userToken = jwt.sign({
      user: user }, process.env.SECRET, { expiresIn: '12h' },
    );
    return userToken;
  },
  authorize(req, res, next) {
    const auth = req.headers.authorization;
    const token = req.body.token || req.headers['x-access-token'] || auth;
    if (token) {
      // console.log('I goooootoototoototototototototo')
      jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {

          return res.status(403).send(err);
        }
        req.decoded = decoded;
          console.log('I goooootoototoototototototototo', decoded);
        return next();
      });
    } else {
      res.status(412).send('Token not provided');
    }
  }
};
