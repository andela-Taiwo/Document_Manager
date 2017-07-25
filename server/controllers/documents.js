const Document = require('../models').Document;

module.exports = {
  addDocument(req, res) {
    return Document
      .create({
        title: req.body.title,
        content: req.body.content,
        access: req.body.access,
        userId: req.params.id,
        roleId: req.body.roleId
      })
      .then(document => res.status(201).send(document))
      .catch(error => res.status(400).send(error));
  },
  getDocument(req, res) {
    return Document
    .find({
      where: {
        id: req.params.id
      }
    })
    .then(document => res.status(201).send(document))
    .catch(error => res.status(400).send(error));
  },
  getAllDocuments(req, res) {
    return Document
    .all()
    .then(documents => res.status(200).send(documents))
    .catch(error => res.status(400).send(error));
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
    });
  }
};
