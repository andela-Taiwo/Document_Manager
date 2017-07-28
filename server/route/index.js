const usersController = require('../controllers').users;
const rolesController = require('../controllers').roles;


// const headers['x-access-token'] = [jwt-token]

module.exports = (app) => {
  app.get('/api/v1', (req, res) => res.status(200).send({
    message: 'Welcome to the Document Manager API!',
  }));
  app.post('/api/v1/roles', rolesController.create);
  app.post('/api/v1/users', usersController.addUser);
  app.get('/api/v1/users', usersController.getAllUsers);
  app.post('/api/v1/users/login', usersController.logginUser);
  app.get('/api/v1/users/:id', usersController.getUser);
  app.put('/api/v1/users/:id', usersController.updateUser);
  app.delete('/api/v1/users/:id', usersController.deleteUser);
};
