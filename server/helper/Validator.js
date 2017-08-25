
/**
* Represents verify the userParams function
*@param {json} request
 *@return {json} result
 */
const verifyUserParams = (request) => {
  request.assert('userName', 'userName field is required').notEmpty();
  request.assert('password', '6 to 15 characters required').len(6, 15);
  request.assert('password', 'password field is required').notEmpty();
  request.assert('email', 'email field is required').notEmpty();
  request.assert('email', 'valid email address is required').isEmail();
  return request.getValidationResult();
};

/**
 * Represents verifyDocParams function
*@param {json} request
 *@return {json} result
 */
const verifyDocParams = (request) => {
  request.assert('title', 'title field is required').notEmpty();
  request.assert('title', '4 to 50 characters required').len(10, 30);
  request.assert('content', 'Document content cannot be empty').notEmpty();
  request.assert('access', 'Document access type is required').notEmpty();
  return request.getValidationResult();
};

/**
 * Represents verifyLoginParams function
*@param {json} request
 *@return {json} result
 */
const verifyLoginParams = (request) => {
  request.assert('email', 'title field is required').notEmpty();
  request.assert('password', '6 to 15 characters required').len(6, 15);
  request.assert('password', 'password content cannot be empty').notEmpty();
  return request.getValidationResult();
};

/**
 * Represents verifyId  function
*@param {json} request
 *@return {boolean} result
 */
const verifyId = (request) => {
  const id = parseInt(request, 10);
  if (isNaN(id)) {
    return false;
  }
  return true;
};

module.exports = {
  verifyUserParams,
  verifyDocParams,
  verifyLoginParams,
  verifyId
};
