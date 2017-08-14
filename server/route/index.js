import Users from '../controllers/users';
import Roles from '../controllers/roles';
import Documents from '../controllers/documents';
import Auth from '../helper/Auth';

const usersController = Users;
const rolesController = Roles;
const documentsController = Documents;
const authorize = Auth.authorize;

// const headers['x-access-token'] = [jwt-token]

module.exports = (app) => {
  app.get('/api/v1', (req, res) => res.status(200).send({
    message: 'Welcome to the Document Manager API!',
  }));
  app.post('/api/v1/roles', authorize, rolesController.create);
  app.get('/api/v1/roles', authorize, rolesController.getAllRoles);
  app.put('/api/v1/roles', authorize, rolesController.updateRole);
  app.post('/api/v1/users', usersController.addUser);
  app.get('/api/v1/users', authorize, usersController.getAllUsers);
  app.post('/api/v1/users/login', usersController.logginUser);
  app.get('/api/v1/users/:id', authorize, usersController.getUser);
  app.put('/api/v1/users', authorize, usersController.updateUser);
  app.get('/api/v1/search/users/', authorize,
      usersController.searchUsers);
  app.delete('/api/v1/users', authorize, usersController.deleteUser);
  app.post('/api/v1/documents', authorize, documentsController.addDocument);
  app.get('/api/v1/users/:id/documents', authorize,
      documentsController.getUserDocuments);
  app.get('/api/v1/documents/:id', authorize,
      documentsController.getDocument);
  app.get('/api/v1/documents', authorize,
      documentsController.getAllDocuments);
  app.put('/api/v1/documents/:id', authorize,
      documentsController.updateDocument);
  app.get('/api/v1/search/documents/', authorize,
      documentsController.searchAllDocuments);
  app.delete('/api/v1/documents/:id', authorize,
      documentsController.deleteDocument);
};
