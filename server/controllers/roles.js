const Role = require('../models').Role;

module.exports = {

  create(req, res) {
    const auth = (req.decoded.user.roleId);
    if (auth === 1) {
      return Role
        .create({
          roleType: req.body.roleType,
        })
        .then(role => res.status(201).send(role))
        .catch(error => res.status(400).send(error));
    }
    res.status(403).send({ message: 'unauthorize user cannot  set role' });
  },
};
