'use strict';

/**
*@param {json} request
 *@param {json} response
 *@param {any} next
 *@return {json} response
 */
var verifyUserParams = function verifyUserParams(request) {
  request.assert('userName', 'userName field is required').notEmpty();
  request.assert('password', 'password field is required').notEmpty();
  request.assert('email', 'email field is required').notEmpty();
  request.assert('email', 'valid email address is required').isEmail();
  return request.getValidationResult();
};
var verifyDocParams = function verifyDocParams(request) {
  request.assert('title', 'title field is required').notEmpty();
  request.assert('title', '10 to 30 characters required').len(10, 30);
  request.assert('content', 'Document content cannot be empty').notEmpty();
  request.assert('access', 'Document access type is required').notEmpty();
  return request.getValidationResult();
};

module.exports = {
  verifyUserParams: verifyUserParams,
  verifyDocParams: verifyDocParams
};