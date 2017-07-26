const usersController = require('../controllers').users;
const rolesController = require('../controllers').roles;
const documentsController = require('../controllers').documents;

module.exports = (app) => {
  app.get('/api/v1', (req, res) => res.status(200).send({
    message: 'Welcome to the Document Manager API!',
  }));
  app.post('/api/v1/roles', rolesController.create);
  app.post('/api/v1/users', usersController.addUser);
  app.get('/api/v1/users', usersController.getAllUsers);
  app.get('/api/v1/users/:id', usersController.getUser);
  app.put('/api/v1/users/:id', usersController.updateUser);
  app.delete('/api/v1/users/:id', usersController.deleteUser);

  app.post('/api/v1/documents/:id', documentsController.addDocument);
  app.get('/api/v1/documents/:id', documentsController.getDocument);
  app.get('/api/v1/documents', documentsController.getAllDocuments);
  app.put('/api/v1/documents/:id', documentsController.updateDocument);
  app.delete('/api/v1/documents/:id', documentsController.deleteDocument);
};
