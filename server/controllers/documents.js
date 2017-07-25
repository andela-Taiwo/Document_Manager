const Document = require('../models').Document;

module.exports = {
  create(req, res) {
    return Document
      .create({
        title: req.body.title,
        content: req.body.content,
        access: req.body.access,
        userId: req.body.userId,
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
};
