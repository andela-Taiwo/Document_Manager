
/**
*@param {json} request
 *@param {json} response
 *@param {any} next
 *@return {json} response
 */
const verifyUserParams = (request) => {
  request.assert('userName', 'userName field is required').notEmpty();
  request.assert('password', 'password field is required').notEmpty();
  request.assert('email', 'email field is required').notEmpty();
  request.assert('email', 'valid email address is required').isEmail();
  return request.getValidationResult();
};
const verifyDocParams = (request) => {
  request.assert('title', 'title field is required').notEmpty();
  request.assert('title', '10 to 30 characters required').len(10, 30);
  request.assert('content', 'Document content cannot be empty').notEmpty();
  request.assert('access', 'Document access type is required').notEmpty();
  return request.getValidationResult();
};

const verifyLoginParams = (request) => {
  request.assert('email', 'title field is required').notEmpty();
  request.assert('password', '10 to 30 characters required').len(6, 20);
  request.assert('password', 'password content cannot be empty').notEmpty();
  return request.getValidationResult();
};

module.exports = {
  verifyUserParams,
  verifyDocParams,
  verifyLoginParams
};
