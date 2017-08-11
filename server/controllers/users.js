import dotenv from 'dotenv';

const User = require('../models').User;
const verifyUserParams = require('../helper/profile').verifyUserParams;
const jwt = require('jsonwebtoken');
const Helper = require('../helper/pagination');
const bcrypt = require('bcrypt');

dotenv.config();

const SECRET_KEY = process.env.SECRET;

module.exports = {
  /**
   *@param {object} req
   * @param {object} res
   * @return {json}  user
   * */
  addUser(req, res) {
    verifyUserParams(req)
    .then((result) => {
      const verifiedParams = result.mapped();
      const noErrors = result.isEmpty();
      if (!noErrors) {
        res.status(401).send(verifiedParams);
        return {};
      }
      const email = req.body.email;
      return User
    .findOne({ where: { email: req.body.email } })
    .then((foundUser) => {
      if (!foundUser) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.send(err);
          }
          const hashPassword = hash;
          User.create({
            userName: req.body.userName,
            password: hashPassword,
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
              SECRET_KEY,
              { expiresIn: 24 * 60 * 60 });
            const data = {
              userName: user.userName,
              message: 'User successfully signup',
              token: myToken,
              userId: user.id,
            };
            res.status(201).json(data);
          });
        });
      } else {
        res.status(403).json({
          message: 'email already exist',

        });
      }
    })
    .catch(() => {
      const data = {
        message: `${email} already exist`,
        token: null,
      };
      return res.status(409).json(data);
    });
    });
  },

  /**
   *@param {object} req
   * @param {object} res
   * @param {object} next
   * @return {json}  Document
   * */
  logginUser(req, res) {
    return User
    .findOne({
      where: {
        email: req.body.email,
      },
    })
    .then((user) => {
      if (bcrypt.compare(req.body.password, user.password)) {
        const userId = user.id;
        const userEmail = user.email;
        const roleId = user.roleId;
        const userDetails = {
          userId,
          userEmail,
          roleId
        };
        const myToken = jwt.sign({ user: userDetails },
          SECRET_KEY,
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

  /**
   *@param {object} req
   * @param {object} res
   * @param {object} next
   * @return {json}  Document
   * */
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
        id: req.decoded.user.userId
      }
    })
    .then((user) => {
      user.update({
        userName: req.body.userName || user.userName,
        password: req.body.password || user.password,
        email: req.body.email || user.email,
        roleId: req.decoded.user.roleId
      }).then((userUpdate) => {
        const data = {
          error: 'false',
          message: 'Update profile successfully',
          data: userUpdate
        };
        res.send(data);
      });
    })
    .catch((error) => {
      res.status(412).json({ msg: error.message });
    });
  },


  /**
   *@param {object} req
   * @param {object} res
   * @return {json}  user
   * */
  searchUsers(req, res) {
    const searchTerm = req.query.q.trim();

    const query = {
      where: {
        $or: [{
          userName: {
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
          return res.status(404).send({
            message: 'Search term does not match any user',
          });
        }
        res.status(200).send({
          pagination, users: users.rows,
        });
      });
  },

  /**
   *@param {object} req
   * @param {object} res
   * @param {object} next
   * @return {json}  status and message
   * */
  deleteUser(req, res) {
    return User
    .destroy({
      where: {
        id: req.decoded.user.userId
      }
    }).then((user) => {
      if (user !== 0) {
        const data = {
          error: 'false',
          message: 'Deleted user successfully',
          data: user
        };
        res.send(data);
      } else {
        res.status(403).send({
          message: 'You are not authorize to delete another user data'
        });
      }
    })
    .catch((error) => {
      res.status(412).json({ msg: error.message });
    });
  }
};
