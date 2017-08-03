'use strict';

var User = require('../models').User;
var verifyUserParams = require('../helper/profile').verifyUserParams;
var jwt = require('jsonwebtoken');
var Helper = require('../helper/pagination');
var bcrypt = require('bcrypt');
var Role = require('../models').Role;

module.exports = {
  addUser: function addUser(req, res) {
    verifyUserParams(req).then(function (result) {
      var verifiedParams = result.mapped();
      var noErrors = result.isEmpty();
      if (!noErrors) {
        res.send(verifiedParams);
        return {};
      }
      var email = req.body.email;
      return User.findOne({ where: { email: req.body.email } }).then(function (foundUser) {
        if (!foundUser) {
          bcrypt.hash(req.body.password, 10, function (err, hash) {
            if (err) {
              res.send(err);
            }
            var hashPassword = hash;
            User.create({
              userName: req.body.userName,
              password: hashPassword,
              email: req.body.email
            }).then(function (user) {
              var userId = user.id;
              var userEmail = user.email;
              var roleId = user.roleId;
              var userDetails = {
                userId: userId,
                userEmail: userEmail,
                roleId: roleId
              };
              var myToken = jwt.sign({ user: userDetails }, 'DOC$-AP1$', { expiresIn: 24 * 60 * 60 });
              var data = {
                userName: user.userName,
                message: 'User successfully signup',
                token: myToken,
                userId: user.id
              };
              res.status(201).json(data);
            });
          });
        }
      }).catch(function () {
        var data = {
          message: email + ' already exist',
          token: null
        };
        return res.status(409).json(data);
      });
    });
  },
  logginUser: function logginUser(req, res) {
    return User.findAndCountAll({
      where: {
        email: req.body.email
      }
    }).then(function (user) {
      console.log('I am a user user user user', user);
      if (bcrypt.compare(req.body.password, user.password)) {
        var userId = user.id;
        var userEmail = user.email;
        var roleId = user.roleId;
        var userDetails = {
          userId: userId,
          userEmail: userEmail,
          roleId: roleId
        };
        var myToken = jwt.sign({ user: userDetails }, 'DOC$-AP1$', { expiresIn: 24 * 60 * 60 });
        res.status(201).send({ token: myToken });
      }
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  },
  getUser: function getUser(req, res) {
    return User.find({
      where: {
        id: req.params.id
      }
    }).then(function (user) {
      return res.status(201).send(user);
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  },
  getAllUsers: function getAllUsers(req, res) {
    return User.all().then(function (users) {
      return res.status(200).send(users);
    }).catch(function (error) {
      res.status(412).json({ msg: error.message });
    });
  },
  updateUser: function updateUser(req, res) {
    return User.findOne({
      where: {
        id: req.decoded.user.userId
      }
    }).then(function (user) {
      user.update({
        userName: req.body.userName,
        password: req.body.password,
        email: req.body.email,
        roleId: req.decoded.user.roleId
      }).then(function (userUpdate) {
        var data = {
          error: 'false',
          message: 'Update profile successfully',
          data: userUpdate
        };
        res.send(data);
      });
    }).catch(function (error) {
      res.status(412).json({ msg: error.message });
    });
  },
  searchUsers: function searchUsers(req, res) {
    var searchTerm = req.query.q.trim();

    var query = {
      where: {
        $or: [{
          userName: {
            $iLike: '%' + searchTerm + '%'
          },
          email: {
            $iLike: '%' + searchTerm + '%'
          }
        }]
      }
    };

    query.limit = req.query.limit > 0 ? req.query.limit : 10;
    query.offset = req.query.offset > 0 ? req.query.offset : 0;
    query.order = ['createdAt'];
    return User.findAndCountAll(query).then(function (users) {
      var pagination = Helper.pagination(query.limit, query.offset, users.count);
      if (!users.rows.length) {
        return res.status(200).send({
          message: 'Search term does not match any user'
        });
      }
      res.status(200).send({
        pagination: pagination, users: users.rows
      });
    });
  },
  deleteUser: function deleteUser(req, res) {
    return User.destroy({
      where: {
        id: req.decoded.user.userId
      }
    }).then(function (user) {
      var data = {
        error: 'false',
        message: 'Deleted user successfully',
        data: user
      };
      res.send(data);
    }).catch(function (error) {
      res.status(412).json({ msg: error.message });
    });
  }
};