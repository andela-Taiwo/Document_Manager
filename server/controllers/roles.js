const Role = require('../models').Role;

module.exports = {
  create(req, res) {
    return Role
      .create({
        roleType: req.body.roleType,
      })
      .then(role => res.status(201).send(role))
      .catch(error => res.status(400).send(error));
  },
};
