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
   * Represents create a user function
   * @param {object} req - the request
   * @param {object} res - the response
   * @return {json}  user - expected return object
   * */
  addUser(req, res) {
    Validator.verifyUserParams(req)
      .then((result) => {
        const verifiedParams = result.mapped();
        const noErrors = result.isEmpty();
        if (!noErrors) {
          console.log(verifiedParams)
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
   * Represents sign in  function
   * @param {object} req - the request
   * @param {object} res - the response
   * @return {json}  User - expected return object
   * */
  logInUser(req, res) {
    Validator.verifyLoginParams(req)
      .then((result) => {
        const verifiedParams = result.mapped();
        const noErrors = result.isEmpty();
        if (!noErrors) {
          res.status(401).send(verifiedParams);
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
              .catch(errorMessage => res.status(400).send({
                errorMessage:
                 'Invalid login parameter, please sign up first and try again',

              }));
      });
  },

  /**
   * Represents get a single user function
   * @param {object} req - the request
   * @param {object} res - the response
   * @return {json}  User - expected return object
   * */
  getUser(req, res) {
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
              errorMessage: 'user id does not exist'
            });
          }
        })
        .catch(error => res.status(400).send({
          errorMessage: `${error.message} invalid parameter`
        }));
  },

  /**
   * Represents get all users function
   * @param {object} req - the request
   * @param {object} res - the response
   * @return {json}  Users - expected return object
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

  /**
   * Represents update user account function
   * @param {object} req - the request
   * @param {object} res - the response
   * @return {json}  User - expected return object
   * */
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
          const userInfo = {
            message: `${userUpdate.userName} Account updated successfully`,
            data: userUpdate
          };
          res.status(200).send(userInfo);
        });
      })
      .catch((error) => {
        res.status(412).json({ errorMessage: error.message });
      });
  },


  /**
   * Represents search for instance of a user function
   * @param {object} req - the request
   * @param {object} res - the response
   * @return {json}  User - expected return object
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

  /**
   * Represents update a single user role function
   * @param {object} req - the request
   * @param {object} res - the response
   * @return {json}  User - expected return object
   * */
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
      .then((user) => {
        if (!isNaN(newRoleId)) {
          models.User.update(
            { roleId: newRoleId },
            { where: { email: user.email }
            })
                .then((userUpdate) => {
                  const userInfo = {
                    message: 'User role updated successfully',
                    user: userUpdate
                  };
                  res.send(userInfo);
                });
        } else {
          res.status(400).json({ errorMessage: 'invalid role ID' });
        }
      })
      .catch((error) => {
        res.status(412).json({ errorMessage: error.message });
      });
    }
    res.status(403).send({ errorMessage: 'You do not have access to set role' });
  },

  /**
   * Represents delete a single user function
   * @param {object} req - the request
   * @param {object} res - the response
   * @return {json}  user - expected return object
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
                message: 'User deleted successfully',
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
            res.status(412).json({ errorMessage: error.message.toString() });
          });
    }

    return models.User.destroy({
      where: {
        $and: [{ id: req.params.id }, { id: req.decoded.user.userId }]
      }
    }).then((user) => {
      if (user !== 0) {
        res.status(200).send({
          message: 'User deleted successfully',
        });
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
