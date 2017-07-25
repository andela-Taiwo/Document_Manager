const User = require('../models').User;

module.exports = {
  create(req, res) {
    return User
      .create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        roleId: req.body.roleId
      })
      .then(user => res.status(201).send(user))
      .catch(error => res.status(400).send(error));
  },
  getUser(req, res) {
    return User
    .find({
      where: {
        id: req.params.id
      }
    })
    .then(user => res.status(201).send(user))
    .catch(error => res.status(400).send(error));
  },
  getAllUsers(req, res) {
    return User
    .all()
    .then(users => res.status(200).send(users))
    .catch(error => res.status(400).send(error));
  },
};
