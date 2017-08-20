
import models from '../models';

module.exports = {
  getAllRoles(req, res) {
    const auth = (req.decoded.user.roleId);
    if (auth === 1 || auth === 2) {
      return models.Role
      .all()
      .then(roles => res.status(200).send({
        message: 'Retrieved roles successfully',
        roles
      }))
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
        .then(role => res.status(201).send({
          message: 'successfully created role',
          role
        }))
        .catch(error => res.status(400).send({
          errorMessage: error.message
        }));
    }
    res.status(403).send({ message: 'unauthorize user cannot  set role' });
  },

  updateRole(req, res) {
    const auth = (req.decoded.user.roleId);
    const newRoleType = req.body.roleType;
    if (auth === 1) {
      return models.Role
      .findById(req.params.id)
      .then((role) => {
        if (role === null || role.length === 0) {
          return res.status(404).send({
            errorMessage: 'role id not found'
          });
        }
        models.Role.update({
          roleType: newRoleType || role.roleType
        },
          { where: { id: req.params.id }
          }
        )
        .then((roleUpdate) => {
          const data = {
            message: 'Update role successfully',
            rolesUpdated: roleUpdate
          };
          res.send(data);
        });
      })
      .catch((error) => {
        res.status(412).json({ errorMessage: error.message });
      });
    }
    res.status(403).send({ message: 'You do not have access to set role' });
  },

  deleteRole(req, res) {
    if (req.decoded.user.roleId === 1) {
      return models.Role
          .destroy({
            where: {
              id: req.params.id
            }
          }).then((role) => {
            if (role !== 0) {
              const data = {
                message: 'Role Deleted successfully',
                rolesDeleted: role
              };
              res.send(data);
            } else {
              res.status(404).send({
                errorMessage: 'role not found'
              });
            }
          })
          .catch((error) => {
            res.status(412).json({ errorMessage: error.message });
          });
    }
    res.status(403).send({
      errorMessage: 'You are not authorized to delete role'
    });
  }

};
