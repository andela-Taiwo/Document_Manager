'use strict';

var Role = require('../models').Role;
var User = require('../models').User;

module.exports = {
  getAllRoles: function getAllRoles(req, res) {
    // console
    var auth = req.decoded.user.roleId;
    if (auth === 1) {
      return Role.all().then(function (roles) {
        return res.status(200).send(roles);
      }).catch(function (error) {
        res.status(412).json({ msg: error.message });
      });
    }
    res.status(403).send({ message: 'You are not authorized to view roles' });
  },
  create: function create(req, res) {
    var auth = req.decoded.user.roleId;
    if (auth === 1) {
      return Role.create({
        roleType: req.body.roleType
      }).then(function (role) {
        return res.status(201).send(role);
      }).catch(function (error) {
        return res.status(400).send(error);
      });
    }
    res.status(403).send({ message: 'unauthorize user cannot  set role' });
  },
  updateRole: function updateRole(req, res) {
    var auth = req.decoded.user.roleId;
    var newRoleId = parseInt(req.body.roleId, 10);
    if (auth === 1) {
      return User.findOne({
        where: {
          email: req.body.email
        },
        attributes: ['roleId']
      }).then(function () {
        if (!isNaN(newRoleId)) {
          User.update({ roleId: newRoleId }, { where: { email: req.body.email } }).then(function (userUpdate) {
            var data = {
              error: 'false',
              message: 'Update profile successfully',
              data: userUpdate
            };
            res.send(data);
          });
        } else {
          res.status(412).json({ msg: 'invalid role ID' });
        }
      }).catch(function (error) {
        res.status(412).json({ msg: error.message });
      });
    }
    res.status(403).send({ message: 'You do not have access set role' });
  }
};