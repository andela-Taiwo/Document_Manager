const User = require('../models').User;
// const verifyUserParams = require('../helper/profile').verifyUserParams;


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
    console.log('Userssssssssss');
    return User
    .all()
    .then(users => res.status(200).send(users))
    .catch(error => res.status(400).send(error));
  },
  updateUser(req, res) {
    return User
    .findOne({
      where: {
        id: req.params.id
      }
    })
    .then((user) => {
      user.update({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        roleId: req.body.roleId
      }).then((userUpdate) => {
        const data = {
          error: 'false',
          message: 'Updated contact successfully',
          data: userUpdate
        };
        res.send(data);
      });
    });
  },
  deleteUser(req, res) {
    return User
    .destroy({
      where: {
        id: req.params.id
      }
    }).then((user) => {
      const data = {
        error: 'false',
        message: 'Deleted user successfully',
        data: user
      };
      res.send(data);
    });
  }
};
