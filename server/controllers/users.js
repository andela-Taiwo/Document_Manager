const User = require('../models').User;
const verifyUserParams = require('../helper/profile').verifyUserParams;


module.exports = {
  addUser(req, res) {
    verifyUserParams(req)
    .then((result) => {
      const verifiedParams = result.mapped();
      const noErrors = result.isEmpty();
      if (!noErrors) {
        res.send(verifiedParams);
        return {};
      }
      return User
        .create({
          userName: req.body.userName,
          password: req.body.password,
          email: req.body.email,
          roleId: req.body.roleId
        })
        .then((user) => {
          res.status(201).send({ user });
        })
        .catch((error) => {
          res.status(412).json({ msg: error.message });
        });
    });
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
    .catch((error) => {
      res.status(412).json({ msg: error.message });
    });
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
        userName: req.body.userName,
        password: req.body.password,
        email: req.body.email,
        roleId: 2
      }).then((userUpdate) => {
        const data = {
          error: 'false',
          message: 'Updated contact successfully',
          data: userUpdate
        };
        res.send(data);
      });
    })
    .catch((error) => {
      res.status(412).json({ msg: error.message });
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
    })
    .catch((error) => {
      res.status(412).json({ msg: error.message });
    });
  }
};
