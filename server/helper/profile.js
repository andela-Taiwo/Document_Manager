const util = require('util');

let errorMessages = null;
/**
*@param {json} request
 *@param {json} response
 *@param {any} next
 *@return {json} response
 */
function verifyUserParams(request) {
  console.log("TIOOOO");
  request.assert('firstName', 'firstName field is required').notEmpty();
  request.assert('lastName', 'lastName field is required').notEmpty();
  request.assert('phoneNumber', 'phoneNumber field is required').notEmpty();
  request.assert('email', 'email field is required').notEmpty();
  request.assert('email', 'valid email address is required').isEmail();
  return request.validationResult()
}

const verifyDocParams = (request) => {
  request.assert('title', 'title is required').notEmpty();
  request.assert('content', 'Content must not be empty').notEmpty();
  return request.validationErrors();
}
module.exports = {
  verifyUserParams,
  verifyDocParams
}
