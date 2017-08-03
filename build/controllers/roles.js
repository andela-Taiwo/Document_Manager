'use strict';

var Role = require('../models').Role;

module.exports = {
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
  }
};