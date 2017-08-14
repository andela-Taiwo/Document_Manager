
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
        return res.status(412).json({ message: verifiedParams });
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
      .catch((error) => {
        res.status(412).json({ msg: error });
      });
    });
  },
  /**
   *@param {object} req
   * @param {object} res
   * @return {json}  document
   * */
  getDocument(req, res) {
    models.Role.findById(req.decoded.user.roleId)
    .then((role) => {
      if (req.decoded.user.roleId === 1) {
        return models.Document
          .findById(req.params.id)
          .then(documents => res.status(200).send(documents))
          .catch(err => res.status(404).send(err.toString()));
      }
      return models.Document
        .findOne({
          where: {
            $or: [
             { access: 'public' },
             { access: role.roleType },
             { $and: [{ access: 'private' }, { userId: req.decoded.user.userId }] }
            ]
          },
          attributes: ['id', 'title', 'access', 'content', 'createdAt']
        })
        .then((documents) => {
          if (documents) {
            res.status(200).send(documents);
          }
        })
        .catch(err => res.status(404).send({
          err: err.toString(),
          message: 'No document found'
        }));
    });
  },
  /**
   *@param {object} req
   * @param {object} res
   * @return {json}  Document
   * */

  getAllDocuments(req, res) {
    const query = req.query;
    models.Role.findById(req.decoded.user.roleId)
    .then((role) => {
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
                message: 'Document not found',
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
             { access: role.roleType },
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
              message: 'Document not found',
            });
          }
          res.status(200).send(documents);
        })
        .catch(err => res.status(400).send(err.toString()));
    });
  },

  getUserDocuments(req, res) {
    const ownerId = parseInt(req.params.id, 10);
    if (isNaN(ownerId)) {
      return res.status(400).send({
        message: 'Invalid parameter, user id can only be integer'
      });
    }
    models.Role.findById(req.decoded.user.roleId)
    .then((role) => {
      if (req.decoded.user.roleId === 1) {
        return models.Document
          .findAll({
            where: {
              userId: req.params.id } })
              .then((documents) => {
                if (documents.length === 0) {
                  return res.status(404).send({
                    message: 'Document not found',
                  });
                }
                res.status(200).send(documents);
              })
              .catch(err => res.status(400).send({
                err: err.toString(),
                message: 'Invalid parameter, user id can only be integer'
              }));
      }
      return models.Document
      .findAll({
        where: {
          $or: [
           { access: 'public' },
           { access: role.roleType },
           { $and: [{ access: 'private' }, { userId: req.decoded.user.userId }] }
          ]
        },
        attributes: ['id', 'title', 'access', 'content', 'createdAt']
      })
      .then((documents) => {
        if (documents.length === 0) {
          return res.status(404).send({
            message: 'Document not found',
          });
        }
        res.status(200).send(documents);
      })
        .catch(err => res.status(400).send({
          err: err.toString(),
          message: 'Invalid parameter, user id can only be integer'
        }));
    });
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
            error: 'false',
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
    models.Role.findById(req.decoded.user.roleId)
    .then((role) => {
      if (req.decoded.user.roleId === 1) {
        return models.Document
        .findAndCountAll(query)
        .then((documents) => {
          const pagination = Helper.pagination(
            query.limit, query.offset, documents.count
          );
          if (!documents.rows.length) {
            return res.status(404).send({
              message: 'Search term does not match any document',
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
             { access: role.roleType },
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
    });
  },

  /**
   *@param {object} req
   * @param {object} res
   * @return {json}  document
   * */
  deleteDocument(req, res) {
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
