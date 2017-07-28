const Document = require('../models').Document;
const verifyDocParams = require('../helper/profile.js').verifyDocParams;

module.exports = {

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
        userId: req.params.id,
        roleId: 2
      })
      .then((document) => {
        res.status(201).send({ document });
      })
      .catch((error) => {
        res.status(412).json({ msg: error.message });
      });
  },
  getDocument(req, res) {
    return Document
    .find({
      where: {
        Id: req.params.id
      }
    })
    .then(document => res.status(201).send(document))
    .catch((error) => {
      res.status(412).json({ msg: error.message });
    });
  },
  getAllDocuments(req, res) {
    return Document
    .all()
    .then(documents => res.status(200).send(documents))
    .catch((error) => {
      res.status(412).json({ msg: error.message });
    });
  },

  updateDocument(req, res) {
    return Document
    .findOne({
      where: {
        userId: req.params.id
      }
    })
    .then((document) => {
      document.update({
        title: req.body.title,
        content: req.body.content,
        userId: req.params.id,
        access: req.body.access,
        roleId: req.body.roleId
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
        id: req.params.id
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
