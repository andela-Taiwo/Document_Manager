const User = require('../models').User;
const verifyUserParams = require('../helper/profile').verifyUserParams;
const jwt = require('jsonwebtoken');
const Helper = require('../helper/pagination');

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
    .findOne({ where: { email: req.body.email } })
    .then((foundUser) => {
      if (!foundUser) {
        User.create({
          userName: req.body.userName,
          password: req.body.password,
          email: req.body.email,
        })
        .then((user) => {
          const userId = user.id;
          const userEmail = user.email;
          const roleId = user.roleId;
          const userDetails = {
            userId,
            userEmail,
            roleId
          };
          const myToken = jwt.sign({ user: userDetails },
            'DOC$-AP1$',
            { expiresIn: 24 * 60 * 60 });
          res.send(200, { token: myToken,
            userId: user.id,
            userName: user.userName });
        });
      } else {
        res.status(404).json('user already exist!');
      }
    })
  .catch((error) => {
    res.status(412).json({ msg: error.message });
  });
    });
  },
  logginUser(req, res) {
    return User
    .findOne({
      where: {
        email: req.body.email,
      }
    })
    .then((user) => {
      if (user.password === req.body.password) {
        const userId = user.id;
        const userEmail = user.email;
        const roleId = user.roleId;
        const userDetails = {
          userId,
          userEmail,
          roleId
        };
        const myToken = jwt.sign({ user: userDetails },
          'DOC$-AP1$',
          { expiresIn: 24 * 60 * 60 });
        res.status(201).send({ token: myToken });
      }
    })
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
  searchUsers(req, res) {
    const searchTerm = req.query.q.trim();

    const query = {
      where: {
        $or: [{
          userName: {
            $iLike: `%${searchTerm}%`,
          },
          email: {
            $iLike: `%${searchTerm}%`,
          },
        }],
      },
    };

    query.limit = (req.query.limit > 0) ? req.query.limit : 10;
    query.offset = (req.query.offset > 0) ? req.query.offset : 0;
    query.order = ['createdAt'];
    return User
      .findAndCountAll(query)
      .then((users) => {
        const pagination = Helper.pagination(
          query.limit, query.offset, users.count
        );
        if (!users.rows.length) {
          return res.status(200).send({
            message: 'Search term does not match any user',
          });
        }
        res.status(200).send({
          pagination, users: users.rows,
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
    })
    .catch((error) => {
      res.status(412).json({ msg: error.message });
    });
  }
};
