
const usersController = require('../controllers').users;
const rolesController = require('../controllers').roles;
const documentsController = require('../controllers').documents;

module.exports = (app) => {
  app.get('/api/v1', (req, res) => res.status(200).send({
    message: 'Welcome to the Document Manager API!',
  }));
  app.post('/api/v1/roles', rolesController.create);

  // user endpoints
  app.post('/api/v1/users', usersController.addUser);
  app.get('/api/v1/users', usersController.getAllUsers);
  app.post('/api/v1/users/login', usersController.logginUser);
  app.get('/api/v1/users/:id', usersController.getUser);
  app.put('/api/v1/users/:id', usersController.updateUser);
  app.delete('/api/v1/users/:id', usersController.deleteUser);
  app.get('api/v1/users/:?limit={integer}&offset={integer}', usersController.getAllUsers);
  app.get('api/v1/users/search/users/?q={}', usersController.searchAllUsers);

  // documents endpoints
  app.post('/api/v1/documents/:id', documentsController.addDocument);
  app.get('/api/v1/documents/:id', documentsController.getDocument);
  app.get('/api/v1/documents', documentsController.getAllDocuments);
  app.put('/api/v1/documents/:id', documentsController.updateDocument);
  app.get('/api/v1/users/:id/documents', documentsController.updateDocument);
  app.get('/api/v1/documents/?limit={integer}&offset={integer}', documentsController.getAllDocuments);
  app.get('/api/v1/search/documents/?q={doctitle}', documentsController.searchAllDocuments);
  app.delete('/api/v1/documents/:id', documentsController.deleteDocument);
};
