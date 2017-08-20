import dotenv from 'dotenv';

const jwt = require('jsonwebtoken');

dotenv.config();
const SECRET_KEY = process.env.SECRET;

module.exports = {
  /**
   * Represents generate the user token function
   * @param {object} user - user details
   * @return {json}  userToken - expected token for authorization
   * */
  setUserToken(user) {
    const userToken = jwt.sign({
      user }, SECRET_KEY, { expiresIn: '12h' },
    );
    return userToken;
  },

  /**
   * Represents verify the user token function
   * @param {object} req - the request
   * @param {object} res - the response
   * @param {object} next
   * @return {json}  Document - expected return object
   * */
  authorize(req, res, next) {
    const auth = req.headers.authorization;
    const token = req.body.token || req.headers['x-access-token'] || auth;
    if (token) {
      jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
          const message = {
            message: 'You are not signed in'
          };
          return res.status(403).send(message);
        }
        req.decoded = decoded;
        return next();
      });
    } else {
      res.status(412).send('Token not provided');
    }
  }
};
