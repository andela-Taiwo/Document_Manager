import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import models from '../models';
import Validator from '../helper/Validator';
import Pagination from '../helper/Pagination';

dotenv.config();
const SECRET_KEY = process.env.SECRET;

module.exports = {
    /**
   *@param {object} req
   * @param {object} res
   * @return {json}  user
   * */
  addUser(req, res) {
    Validator.verifyUserParams(req)
      .then((result) => {
        const verifiedParams = result.mapped();
        const noErrors = result.isEmpty();
        if (!noErrors) {
          res.status(401).send(verifiedParams);
          return {};
        }
        const email = req.body.email;
        return models.User
            .findOne({ where: { email: req.body.email } })
            .then((foundUser) => {
              if (!foundUser) {
                models.User.create({
                  userName: req.body.userName,
                  password: req.body.password,
                  email: req.body.email,
                  roleId: 3
                })
                    .then((user) => {
                      const userId = user.id;
                      const roleId = user.roleId;
                      const userDetails = {
                        userId,
                        roleId
                      };
                      const myToken = jwt.sign({ user: userDetails },
                          SECRET_KEY, { expiresIn: 24 * 60 * 60 });
                      const data = {
                        userName: user.userName,
                        message: `${user.userName} successfully signed up`,
                        userId: user.id,
                        token: myToken,
                      };
                      res.status(201).json(data);
                    });
              } else {
                res.status(403).json({
                  errorMessage: 'email already exist',

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
    Validator.verifyLoginParams(req)
      .then((result) => {
        const verifiedParams = result.mapped();
        const noErrors = result.isEmpty();
        if (!noErrors) {
          res.send(verifiedParams);
          return {};
        }
        const password = req.body.password;
        return models.User
              .findOne({
                where: {
                  email: req.body.email,
                },
              })
              .then((user) => {
                if (bcrypt.compareSync(password, user.password)) {
                  const userId = user.id;
                  const roleId = user.roleId;
                  const userDetails = {
                    userId,
                    roleId
                  };
                  const myToken = jwt.sign({ user: userDetails },
                      SECRET_KEY, { expiresIn: 24 * 60 * 60 });
                  res.status(200).send({
                    message: `You are logged in ${user.userName} `,
                    token: myToken
                  });
                } else {
                  res.status(401).send({
                    errorMessage: 'Invalid email or password'
                  });
                }
              })
              .catch(error => res.status(400).send({
                errorMessage: `${error} invalid parameter`
              }));
      });
  },
  getUser(req, res) {
    const ownerId = parseInt(req.params.id, 10);
    if (isNaN(ownerId)) {
      return res.status(400).send({
        errorMessage: 'Invalid parameter, user id can only be integer'
      });
    }
    return models.User
        .find({
          where: {
            id: req.params.id
          },
          attributes: ['id', 'userName', 'email']
        })
        .then((user) => {
          if (user) {
            res.status(200).send({
              message: 'User successfully retrieved',
              user,
            });
          } else {
            res.status(404).send({
              errorMessage: 'user does not exist'
            });
          }
        })
        .catch(error => res.status(400).send({
          errorMessage: `${error} invalid parameter`
        }));
  },

  /**
   *@param {object} req
   * @param {object} res
   * @param {object} next
   * @return {json}  Document
   * */
  getAllUsers(req, res) {
    const query = {
      attributes: ['userName', 'email']
    };
    query.limit = (req.query.limit > 0) ? req.query.limit : 10;

    query.offset = (req.query.offset > 0) ? req.query.offset : 0;
    query.order = ['createdAt'];

    return models.User
        .findAndCountAll(query)
        .then((users) => {
          const pagination = Pagination.pages(
            query.limit, query.offset, users.count
          );
          res.status(200).send({
            message: 'Users successfully retrieved',
            users: users.rows,
            pagination,
          });
        })
        .catch((error) => {
          res.status(412).json({ errorMessage: error.message });
        });
  },
  updateUser(req, res) {
    return models.User
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
            message: 'Update profile successfully',
            data: userUpdate
          };
          res.status(200).send(data);
        });
      })
      .catch((error) => {
        res.status(412).json({ errorMessage: error.message });
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

        userName: {
          $iLike: `%${searchTerm}%`,
        },
      },
      attributes: ['userName', 'email']
    };

    query.limit = (req.query.limit > 0) ? req.query.limit : 10;
    query.offset = (req.query.offset > 0) ? req.query.offset : 0;
    query.order = ['createdAt'];
    return models.User
      .findAndCountAll(query)
      .then((users) => {
        const pagination = Pagination.pages(
          query.limit, query.offset, users.count
        );
        if (!users.rows.length) {
          return res.status(404).send({
            errorMessage: 'Search term does not match any user',
          });
        }
        res.status(200).send({
          message: 'successfully retrieved user(s)',
          users: users.rows,
          pagination,
        });
      });
  },

  updateUserRole(req, res) {
    const auth = (req.decoded.user.roleId);
    const userEmail = req.body.email;
    const newRoleId = parseInt(req.body.roleId, 10);
    if (auth === 1) {
      return models.User
      .findOne({
        where: {
          email: userEmail
        },
        attributes: ['roleId']
      })
      .then(() => {
        if (!isNaN(newRoleId)) {
          models.User.update(
            { roleId: newRoleId },
            { where: { email: req.body.email }
            })
                .then((userUpdate) => {
                  const data = {
                    message: 'Update profile successfully',
                    data: userUpdate
                  };
                  res.send(data);
                });
        } else {
          res.status(412).json({ msg: 'invalid role ID' });
        }
      })
      .catch((error) => {
        res.status(412).json({ msg: error.message });
      });
    }
    res.status(403).send({ message: 'You do not have access to set role' });
  },

  /**
   *@param {object} req
   * @param {object} res
   * @param {object} next
   * @return {json}  status and message
   * */
  deleteUser(req, res) {
    if (req.decoded.user.roleId === 1) {
      return models.User
          .destroy({
            where: {
              id: req.params.id
            }
          }).then((user) => {
            if (user !== 0) {
              const data = {
                message: 'Deleted user successfully',
                usersDeleted: user
              };
              res.send(data);
            } else {
              res.status(404).send({
                errorMessage: 'user id is not found'
              });
            }
          })
          .catch((error) => {
            res.status(412).json({ errorMessage: error.message });
          });
    }

    return models.User.destroy({
      where: {
        $and: [{ id: req.params.id }, { id: req.decoded.user.userId }]
      }
    }).then((user) => {
      if (user !== 0) {
        const data = {
          message: 'Deleted user successfully',
          data: user
        };
        res.send(data);
      } else {
        res.status(403).send({
          errorMessage:
          'You are not authorized to delete another user account'
        });
      }
    })
  .catch((error) => {
    res.status(412).json({ errorMessage: error.message });
  });
  }
};
