const Document = require('../models').Document;
const Role = require('../models').Role;
const verifyDocParams = require('../helper/profile.js').verifyDocParams;

module.exports = {

  /**
   *@param {object} req
   * @param {object} res
   * @return {json}  Document
   * */
  addDocument(req, res) {
    verifyDocParams(req)
    .then((result) => {
      const verifiedParams = result.mapped();
      const noErrors = result.isEmpty();
      if (!noErrors) {
        res.send(verifiedParams);
        return {};
      }
    });
    return Document
      .create({
        title: req.body.title,
        content: req.body.content,
        access: req.body.access,
        userId: req.decoded.user.userId,
        roleId: req.decoded.user.roleId
      })
      .then((document) => {
        res.status(201).send({ document });
      });
      // .catch((error) => {
      //   res.status(412).json({ msg: error.message });
      // });
  },
  getDocument(req, res) {
    Role.findById(req.decoded.user.roleId)
    .then((role) => {
      if (req.decoded.user.roleId === 1) {
        return Document
          .findById(req.params.id)
          .then(documents => res.status(200).send(documents))
          .catch(err => res.status(400).send(err.toString()));
      }
      return Document
        .findAll({
          where: {
            id: req.params.id,
            access: [role.roleType, 'public'] },
          attributes: ['id', 'title', 'access', 'content', 'createdAt']
        })
        .then(documents => res.status(200).send(documents))
        .catch(err => res.status(400).send(err.toString()));
    });
  },
  /**
   *@param {object} req
   * @param {object} res
   * @return {json}  Document
   * */

  getAllDocuments(req, res) {
    Role.findById(req.decoded.user.roleId)
    .then((role) => {
      if (req.decoded.user.roleId === 1) {
        return Document
          .findAll({
            attributes: ['id', 'title', 'content', 'access', 'createdAt']
          })
          .then(documents => res.status(200).send(documents))
          .catch(() => res.status(400).send('Connection Error'));
      }
      return Document
        .findAll({
          where: { access: [role.roleType, 'public'] },
          attributes: ['id', 'title', 'access', 'content', 'createdAt']
        })
        .then(documents => res.status(200).send(documents))
        .catch(err => res.status(400).send(err.toString()));
    });
  },

  /**
   *@param {object} req
   * @param {object} res
   * @return {json}  document
   * */

  updateDocument(req, res) {
    return Document
    .findOne({
      where: {
        id: req.params.id,
        userId: req.decoded.user.userId
      }
    })
    .then((document) => {
      document.update({
        title: req.body.title,
        content: req.body.content,
        userId: req.decoded.user.userId,
        access: req.body.access,
        roleId: req.decoded.user.roleId
      }).then((documentUpdate) => {
        const updatedDocument = {
          error: 'false',
          message: 'Updated document successfully',
          updatedDocument: documentUpdate
        };
        res.send(updatedDocument);
      });
    })
    .catch((error) => {
      res.status(412).json({ msg: error.message });
    });
  },
  deleteDocument(req, res) {
    return Document
    .destroy({
      where: {
        id: req.params.id,
        userId: req.decoded.user.userId
      }
    }).then((deleteDocument) => {
      const deletedDocument = {
        error: 'false',
        message: 'Deleted document successfully',
        deletedDocument: deleteDocument
      };
      res.send(deletedDocument);
    })
    .catch((error) => {
      res.status(412).json({ msg: error.message });
    });
  }
};
