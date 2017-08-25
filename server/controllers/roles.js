
import models from '../models';

module.exports = {
  /**
   * Represents get all roles function
   * @param {object} req - the request
   * @param {object} res - the response
   * @return {json}  Roles - expected return object
   * */
  getAllRoles(req, res) {
    const auth = (req.decoded.user.roleId);
    if (auth === 1 || auth === 2) {
      return models.Role
      .findAndCountAll()
      .then(roles => res.status(200).send({
        message: 'Retrieved roles successfully',
        roles,
        returnedRoles: roles.count
      }))
      .catch((error) => {
        res.status(412).json({ errorMessage: error.message });
      });
    }
    res.status(403).send({ errorMessage: 'You are not authorized to view roles' });
  },

  /**
   * Represents create a role function
   * @param {object} req - the request
   * @param {object} res - the response
   * @return {json}  Role - expected return object
   * */
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
    res.status(403).send({ errorMessage: 'unauthorize user cannot  set role' });
  },

  /**
   * Represents update a single role function
   * @param {object} req - the request
   * @param {object} res - the response
   * @return {json}  Role - expected return object
   * */
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
        .then(() => {
          res.status(200).send({
            message: 'Role updated succesfully'
          });
        });
      })
      .catch((error) => {
        res.status(412).json({ errorMessage: error.message });
      });
    }
    res.status(403).send({ errorMessage: 'You do not have access to set role' });
  },

  /**
   * Represents delete a single role function
   * @param {object} req - the request
   * @param {object} res - the response
   * @return {json}  Role - expected return object
   * */
  deleteRole(req, res) {
    if (req.decoded.user.roleId === 1) {
      return models.Role
          .destroy({
            where: {
              id: req.params.id
            }
          }).then((role) => {
            if (role !== 0) {
              res.status(200).send({
                message: 'Role Deleted successfully'
              });
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
