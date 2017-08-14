
import models from '../models';

module.exports = {
  getAllRoles(req, res) {
    const auth = (req.decoded.user.roleId);
    if (auth === 1) {
      return models.Role
      .all()
      .then(roles => res.status(200).send(roles))
      .catch((error) => {
        res.status(412).json({ msg: error.message });
      });
    }
    res.status(403).send({ message: 'You are not authorized to view roles' });
  },

  create(req, res) {
    const auth = (req.decoded.user.roleId);
    if (auth === 1) {
      return models.Role
        .create({
          roleType: req.body.roleType,
        })
        .then(role => res.status(201).send(role))
        .catch(error => res.status(400).send(error));
    }
    res.status(403).send({ message: 'unauthorize user cannot  set role' });
  },

  updateRole(req, res) {
    const auth = (req.decoded.user.roleId);
    const newRoleId = parseInt(req.body.roleId, 10);
    if (auth === 1) {
      return models.User
      .findOne({
        where: {
          email: req.body.email
        },
        attributes: ['roleId']
      })
      .then(() => {
        if (!isNaN(newRoleId)) {
          models.User.update({ roleId: newRoleId },
                { where: { email: req.body.email } })
                .then((userUpdate) => {
                  const data = {
                    error: 'false',
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
    res.status(403).send({ message: 'You do not have access set role' });
  }

};
