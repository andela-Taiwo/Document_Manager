'use strict';

var usersController = require('../controllers').users;
var rolesController = require('../controllers').roles;
var documentsController = require('../controllers').documents;
var authorize = require('../helper/auth.js').authorize;

// const headers['x-access-token'] = [jwt-token]

module.exports = function (app) {
  app.get('/api/v1', function (req, res) {
    return res.status(200).send({
      message: 'Welcome to the Document Manager API!'
    });
  });
  app.post('/api/v1/roles', authorize, rolesController.create);
  app.post('/api/v1/users', usersController.addUser);
  app.get('/api/v1/users', authorize, usersController.getAllUsers);
  app.post('/api/v1/users/login', usersController.logginUser);
  app.get('/api/v1/users/:id', authorize, usersController.getUser);
  app.put('/api/v1/users', authorize, usersController.updateUser);
  app.get('/api/v1/search/users', authorize, usersController.searchUsers);
  app.delete('/api/v1/users', authorize, usersController.deleteUser);
  app.post('/api/v1/documents', authorize, documentsController.addDocument);
  app.get('/api/v1/users/:id/documents', authorize, documentsController.getUserDocuments);
  app.get('/api/v1/documents/:id', authorize, documentsController.getDocument);
  app.get('/api/v1/documents', authorize, documentsController.getAllDocuments);
  app.put('/api/v1/documents/:id', authorize, documentsController.updateDocument);
  app.get('/api/v1/search/documents', authorize, documentsController.searchAllDocuments);
  app.delete('/api/v1/documents/:id', authorize, documentsController.deleteDocument);
};