import models from '../models';
import Validator from '../helper/Validator';
import Helper from '../helper/Helper';

module.exports = {

  /**
   *@param {object} req
   * @param {object} res
   * @return {json}  Document
   * */
  addDocument(req, res) {
    Validator.verifyDocParams(req)
    .then((result) => {
      const verifiedParams = result.mapped();
      const noErrors = result.isEmpty();
      if (noErrors === false) {
        return res.status(412).json({ errorMessage: verifiedParams });
      }
      return models.Document
      .create({
        title: req.body.title,
        content: req.body.content,
        access: req.body.access,
        userId: req.decoded.user.userId,
        roleId: req.decoded.user.roleId
      })
      .then((document) => {
        res.status(201).json({
          title: document.title,
          message: 'New Document created successfully',
          ownerId: document.userId, });
      })
      .catch((err) => {
        res.status(412).json({ errorMessage: err });
      });
    });
  },

  /**
   * @param {object} req
   * @param {object} res
   * @return {json}  document
   * */
  getDocument(req, res) {
    if (req.decoded.user.roleId === 1) {
      return models.Document
        .findById(req.params.id)
        .then((document) => {
          if (document) {
            res.status(200).send(document);
          } else {
            res.status(404).send({
              errorMessage: 'Document not found'
            });
          }
        })
        .catch(err => res.status(404).send(err.toString()));
    }
    return models.Document
      .findOne({
        where: {
          id: req.params.id,
          $or: [
           { access: 'public' },
           { access: 'role', roleId: req.decoded.user.roleId },
           { $and: [{ access: 'private' }, { userId: req.decoded.user.userId }] }
          ]
        },
        attributes: ['id', 'title', 'access', 'content', 'createdAt']
      })
      .then((document) => {
        if (document) {
          res.status(200).send(document);
        } else {
          res.status(404).send({
            errorMessage: 'Document not found'
          });
        }
      })
      .catch(err => res.status(400).send({
        errorMessage: err.toString(),
      }));
  },
  /**
   * @param {object} req
   * @param {object} res
   * @return {json}  Document
   * */
  getAllDocuments(req, res) {
    const query = req.query;
    if (req.decoded.user.roleId === 1) {
      return models.Document
        .findAll({
          attributes: ['id', 'title', 'content', 'access', 'createdAt'],
          offset: (query.offset) || 0,
          limit: query.limit || 10
        })
        .then((documents) => {
          if (documents.length === 0) {
            return res.status(404).send({
              errorMessage: 'Document not found',
            });
          }
          res.status(200).send(documents);
        })
        .catch(() => res.status(400).send('Connection Error'));
    }
    return models.Document
      .findAll({
        where: {
          $or: [
           { access: 'public' },
           { access: 'role', roleId: req.decoded.user.roleId },
            {
              $and: [{ access: 'private' }, { userId: req.decoded.user.userId }]
            }
          ]
        },
        attributes: ['id', 'title', 'access', 'content', 'createdAt'],
        offset: (query.offset) || 0,
        limit: query.limit || 10
      })
      .then((documents) => {
        if (documents.length === 0) {
          return res.status(404).send({
            errorMessage: 'Document not found',
          });
        }
        res.status(200).send(documents);
      })
      .catch(err => res.status(400).send(err.toString()));
  },

  getUserDocuments(req, res) {
    const ownerId = parseInt(req.params.id, 10);
    if (isNaN(ownerId)) {
      return res.status(400).send({
        errorMessage: 'Invalid parameter, user id can only be integer'
      });
    }

    if (req.decoded.user.roleId === 1) {
      return models.Document
        .findAll({
          where: {
            userId: req.params.id } })
            .then((documents) => {
              if (documents.length === 0) {
                return res.status(404).send({
                  errorMessage: 'Document not found',
                });
              }
              res.status(200).send(documents);
            })
            .catch(err => res.status(400).send({
              err: err.toString(),
              errorMessage: 'Invalid parameter, user id can only be integer'
            }));
    }
    return models.Document
    .findAll({
      where: {
        $or: [
         { access: 'public' },
         { access: 'role', roleId: req.decoded.user.roleId },
         { $and: [{ access: 'private' }, { userId: req.decoded.user.userId }] }
        ]
      },
      attributes: ['id', 'title', 'access', 'content', 'createdAt']
    })
    .then((documents) => {
      if (documents.length === 0) {
        return res.status(404).send({
          errorMessage: 'Document not found',
        });
      }
      res.status(200).send(documents);
    })
      .catch(err => res.status(400).send({
        err: err.toString(),
        errorMessage: 'Invalid parameter, user id can only be integer'
      }));
  },
  /**
   *@param {object} req
   * @param {object} res
   * @return {json}  document
   * */

  updateDocument(req, res) {
    return models.Document
    .findOne({
      where: {
        userId: req.decoded.user.userId,
        id: req.params.id,
      }
    })
    .then((document) => {
      if (req.decoded.user.userId === document.userId) {
        document.update({
          title: req.body.title || document.title,
          content: req.body.content || document.content,
          userId: req.decoded.user.userId,
          access: req.body.access || document.access,
          roleId: req.decoded.user.roleId
        }).then((documentUpdate) => {
          const updatedDocument = {
            message: 'Updated document successfully',
            updatedDocument: documentUpdate
          };
          res.send(updatedDocument);
        });
      }
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
    if (req.decoded.user.roleId === 1) {
      return models.Document
      .findAndCountAll(query)
      .then((documents) => {
        const pagination = Helper.pagination(
          query.limit, query.offset, documents.count
        );
        if (!documents.rows.length) {
          return res.status(404).send({
            error: 'Search term does not match any document',
          });
        }
        res.status(200).send({
          pagination, documents: documents.rows,
        });
      });
    }
    return models.Document
      .findAndCountAll({
        where: {
          title: {
            $iLike: `%${searchTerm}%`,
          },
          $or: [
           { access: 'public' },
           { access: 'role', roleId: req.decoded.user.roleId },
           { $and: [{ access: 'private' }, { userId: req.decoded.user.userId }] }
          ]
        },
        attributes: ['id', 'title', 'access', 'content', 'createdAt']
      })
      .then((documents) => {
        const pagination = Helper.pagination(
          query.limit, query.offset, documents.count
        );
        if (!documents.rows.length) {
          return res.status(404).send({
            error: 'Search term does not match any document',
          });
        }
        res.status(200).send({
          documents: documents.rows,
          pagination
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
    Validator.verifyId(req.params.id);
    return models.Document
    .findOne({
      where: {
        userId: req.decoded.user.userId,
        id: req.params.id,
      }
    }).then((document) => {
      if (req.decoded.user.userId === document.userId) {
        document.destroy({
          where: {
            id: req.params.id,
            userId: req.decoded.user.userId
          }
        });
      }
    })
    .then((deleteDocument) => {
      const deletedDocument = {

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
