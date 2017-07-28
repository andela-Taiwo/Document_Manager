const Document = require('../models').Document;
const Role = require('../models').Role;
const verifyDocParams = require('../helper/profile.js').verifyDocParams;
const Helper = require('../helper/pagination');

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
      })
      .catch((error) => {
        res.status(412).json({ msg: error.message });
      });
  },
  /**
   *@param {object} req
   * @param {object} res
   * @return {json}  document
   * */
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
    const query = req.query;
    Role.findById(req.decoded.user.roleId)
    .then((role) => {
      if (req.decoded.user.roleId === 1) {
        return Document
          .findAll({
            attributes: ['id', 'title', 'content', 'access', 'createdAt'],
            offset: (query.offset) || 0,
            limit: query.limit || 0
          })
          .then(documents => res.status(200).send(documents))
          .catch(() => res.status(400).send('Connection Error'));
      }
      return Document
        .findAll({
          where: { access: [role.roleType, 'public'] },
          attributes: ['id', 'title', 'access', 'content', 'createdAt'],
          offset: (query.offset) || 0,
          limit: query.limit || 10
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

  /**
   *@param {object} req
   * @param {object} res
   * @return {json}  documents
   * */

  searchAllDocuments(req, res) {
    const searchTerm = req.query.q.trim();
    const query = {
      where: {

        title: {
          $iLike: `%${searchTerm}%`,
        },

      },
    };

    query.limit = (req.query.limit > 0) ? req.query.limit : 10;
    query.offset = (req.query.offset > 0) ? req.query.offset : 0;
    query.order = ['createdAt'];
    return Document
      .findAndCountAll(query)
      .then((documents) => {
        const pagination = Helper.pagination(
          query.limit, query.offset, documents.count
        );
        if (!documents.rows.length) {
          return res.status(200).send({
            message: 'Search term does not match any document',
          });
        }
        res.status(200).send({
          pagination, documents: documents.rows,
        });
      })
      .catch((error) => {
        res.status(412).json({ msg: error.message });
      });
  },

  /**
   *@param {object} req
   * @param {object} res
   * @return {json}  document
   * */
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
