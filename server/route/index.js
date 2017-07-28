const usersController = require('../controllers').users;
const rolesController = require('../controllers').roles;
const documentsController = require('../controllers').documents;
const authorize = require('../helper/auth.js').authorize;

// const headers['x-access-token'] = [jwt-token]

module.exports = (app) => {
  app.get('/api/v1', (req, res) => res.status(200).send({
    message: 'Welcome to the Document Manager API!',
  }));
  app.post('/api/v1/roles', authorize, rolesController.create);
  app.post('/api/v1/users', usersController.addUser);
  app.get('/api/v1/users', authorize, usersController.getAllUsers);
  app.post('/api/v1/users/login', usersController.logginUser);
  app.get('/api/v1/users/:id', authorize, usersController.getUser);
  app.put('/api/v1/users/:id', authorize, usersController.updateUser);
  app.get('/api/v1/search/users', authorize, usersController.searchUsers);
  app.delete('/api/v1/users/:id', authorize, usersController.deleteUser);
  app.post('/api/v1/documents', authorize, documentsController.addDocument);
  // app.post('/api/v1/documents/:id', authorize, documentsController.addDocument);
  app.get('/api/v1/documents/:id', authorize, documentsController.getDocument);
  app.get('/api/v1/documents', authorize, documentsController.getAllDocuments);
  app.put('/api/v1/documents/:id', authorize, documentsController.updateDocument);
  app.delete('/api/v1/documents/:id', authorize, documentsController.deleteDocument);
};
