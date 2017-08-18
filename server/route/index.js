import Users from '../controllers/users';
import Roles from '../controllers/roles';
import Documents from '../controllers/documents';
import Auth from '../helper/auth';

const usersController = Users;
const rolesController = Roles;
const documentsController = Documents;
const authorize = Auth.authorize;

module.exports = (app) => {
  // index routes
  app.get('/api/v1', (req, res) => res.status(200).send({
    message: 'Welcome to the Reliable-Docs API!',
  }));


  // User routes
  app.post('/api/v1/roles', authorize, Roles.create);
  app.get('/api/v1/roles', authorize, Roles.getAllRoles);
  app.put('/api/v1/roles', authorize, Roles.updateRole);
  app.post('/api/v1/users', Users.addUser);
  app.get('/api/v1/users', authorize, Users.getAllUsers);
  app.post('/api/v1/users/login', Users.logginUser);
  app.get('/api/v1/users/:id', authorize, Users.getUser);
  app.put('/api/v1/users', authorize, Users.updateUser);
  app.get('/api/v1/search/users/', authorize,
      Users.searchUsers);
  app.delete('/api/v1/users/:id', authorize, Users.deleteUser);


  // Document routes
  app.post('/api/v1/documents', authorize, Documents.addDocument);
  app.get('/api/v1/users/:id/documents', authorize,
      Documents.getUserDocuments);
  app.get('/api/v1/documents/:id', authorize,
      Documents.getDocument);
  app.get('/api/v1/documents', authorize,
      Documents.getAllDocuments);
  app.put('/api/v1/documents/:id', authorize,
      Documents.updateDocument);
  app.get('/api/v1/search/documents/', authorize,
      Documents.searchAllDocuments);
  app.delete('/api/v1/documents/:id', authorize,
      Documents.deleteDocument);

  // Invalid end point
  app.get('*', (req, res) => res.status(200).send({
    message: 'Welcome to invalid end point!',
  }));
  app.post('*', (req, res) => res.status(200).send({
    message: 'Welcome to invalid end point!',
  }));
  app.put('*', (req, res) => res.status(200).send({
    message: 'Invalid end point!',
  }));
  app.delete('*', (req, res) => res.status(200).send({
    message: 'Welcome to invalid end point!',
  }));
};
