//
// const usersController = require('../controllers').users;
// const rolesController = require('../controllers').roles;
// const documentsController = require('../controllers').documents;
// const authorize = require('../helper/auth.js').authorize;
//
// module.exports = (app) => {
//   app.get('/api/v1', (req, res) => res.status(200).send({
//     message: 'Welcome to the Document Manager API!',
//   }));
//   app.post('/api/v1/roles', rolesController.create);
//
//   // user endpoints
//   app.post('/api/v1/users', usersController.addUser);
//   app.get('/api/v1/users', authorize, usersController.getAllUsers);
//   app.post('/api/v1/users/login', authorize, usersController.logginUser);
//   app.get('/api/v1/users/:id', authorize, usersController.getUser);
//   app.put('/api/v1/users/:id', authorize, usersController.updateUser);
//   app.delete('/api/v1/users/:id', authorize, usersController.deleteUser);
//   app.get('api/v1/users/:?limit={integer}&offset={integer}', authorize, usersController.getAllUsers);
//   app.get('api/v1/users/search/users/?q={}', authorize, usersController.searchAllUsers);
//
//   // documents endpoints
//   app.post('/api/v1/documents/:id', authorize, documentsController.addDocument);
//   app.get('/api/v1/documents/:id', authorize, documentsController.getDocument);
//   app.get('/api/v1/documents', authorize, documentsController.getAllDocuments);
//   app.put('/api/v1/documents/:id', authorize, documentsController.updateDocument);
//   app.get('/api/v1/users/:id/documents', authorize, documentsController.updateDocument);
//   app.get('/api/v1/documents/?limit={integer}&offset={integer}', authorize, documentsController.getAllDocuments);
//   app.get('/api/v1/search/documents/?q={doctitle}', authorize, documentsController.searchAllDocuments);
//   app.delete('/api/v1/documents/:id', authorize, documentsController.deleteDocument);
// };
const usersController = require('../controllers').users;
const rolesController = require('../controllers').roles;
const documentsController = require('../controllers').documents;
const authorize = require('../helper/auth').authorize;

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
  app.delete('/api/v1/users/:id', authorize, usersController.deleteUser);

  app.post('/api/v1/documents/:id', authorize, documentsController.addDocument);
  app.get('/api/v1/documents/:id', authorize, documentsController.getDocument);
  app.get('/api/v1/documents', authorize, documentsController.getAllDocuments);
  app.put('/api/v1/documents/:id', authorize, documentsController.updateDocument);
  app.delete('/api/v1/documents/:id', authorize, documentsController.deleteDocument);
};
