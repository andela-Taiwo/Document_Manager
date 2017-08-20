import models from '../models';
import Validator from '../helper/Validator';
import Pagination from '../helper/Pagination';

module.exports = {

  /**
   *@param {object} req
   * @param {object} res
   * @return {json}  Document
   * */
  addDocument(req, res) {
    Validator.verifyDocParams(req)
    .then((result) => {
      const accessType = ['role', 'public', 'private'];
      const verifiedParams = result.mapped();
      const noErrors = result.isEmpty();
      if (noErrors === false) {
        return res.status(412).json({ errorMessage: verifiedParams });
      }

      return models.Document
        .findOne({ where: { title: req.body.title } })
        .then((foundDoc) => {
          if (accessType.indexOf((req.body.access).toLowerCase()) === -1) {
            return res.status(400).send({
              errorMessage: 'Invalid access parameter'
            });
          }
          if (!foundDoc) {
            models.Document.create({
              title: req.body.title,
              content: req.body.content,
              access: req.body.access,
              userId: req.decoded.user.userId,
              roleId: req.decoded.user.roleId
            })
          .then((document) => {
            res.status(201).json({
              message: 'New Document created successfully',
              title: document.title,
              content: document.content,
              ownerId: document.userId, });
          })
          .catch((err) => {
            res.status(412).json({ errorMessage: err });
          });
          } else {
            res.status(400).send({
              errorMessage: 'Document already exist'
            });
          }
        });
    });
  },


  /**
   * @param {object} req
   * @param {object} res
   * @return {json}  document
   * */
  getDocument(req, res) {
    if (Validator.verifyId(req.params.id)) {
      if (req.decoded.user.roleId === 1) {
        return models.Document
          .findById(req.params.id)
          .then((document) => {
            if (document === null || document.length === 0) {
              res.status(404).send({
                errorMessage: 'Document not found'
              });
            } else {
              res.status(200).send(document);
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
              {
                $and: [{ access: 'private' },
                { userId: req.decoded.user.userId }]
              }
            ]
          },
          attributes: ['id', 'title', 'access', 'content', 'createdAt']
        })
        .then((document) => {
          if (document) {
            res.status(200).send(document);
          } else {
            res.status(403).send({
              errorMessage: 'You are not authorized to view this document'
            });
          }
        })
        .catch(err => res.status(400).send({
          errorMessage: err.toString(),
        }));
    }
    return res.status(400).send({
      errorMessage: 'Invalid parameter, document id can only be integer'
    });
  },


  /**
   * @param {object} req
   * @param {object} res
   * @return {json}  Document
   * */
  getAllDocuments(req, res) {
    const query = {
      where: {
        $or: [
         { access: 'public' },
         { access: 'role', roleId: req.decoded.user.roleId },
          {
            $and: [{ access: 'private' }, { userId: req.decoded.user.userId }]
          }
        ]
      },
      attributes: ['id', 'title', 'access', 'content', 'createdAt', 'userId'],
    };

    query.limit = (req.query.limit > 0) ? req.query.limit : 10;

    query.offset = (req.query.offset > 0) ? req.query.offset : 0;
    query.order = ['createdAt'];

    if (req.decoded.user.roleId === 1) {
      return models.Document
        .findAndCountAll({
          offset: query.offset,
          limit: query.limit,
          order: query.order,
          attributes: ['id', 'title', 'content', 'access', 'createdAt'],
        })
        .then((documents) => {
          const pagination = Pagination.pages(
            query.limit, query.offset, documents.count
          );
          if (!documents.rows.length) {
            return res.status(404).send({
              errorMessage: 'No document found',
            });
          }
          res.status(200).send({
            message: 'Documents retrieved succesfully',
            documents: documents.rows,
            pagination,
          });
        })
        .catch(err => res.status(400).send({
          errorMessage: err.toString()
        }));
    }

    return models.Document
      .findAndCountAll(query)
      .then((documents) => {
        const pagination = Pagination.pages(
          query.limit, query.offset, documents.count
        );
        if (!documents.rows.length) {
          return res.status(404).send({
            errorMessage: 'No document found',
          });
        }
        res.status(200).send({
          documents: documents.rows,
          pagination,
        });
      })
      .catch(err => res.status(400).send(err.toString()));
  },


  getUserDocuments(req, res) {
    const query = {
      where: {
        userId: req.params.id,
        $or: [
         { access: 'public' },
         { access: 'role', roleId: req.decoded.user.roleId },
          {
            $and: [{ access: 'private' }, { userId: req.decoded.user.userId }]
          }
        ]
      },
      attributes: ['id', 'title', 'access', 'content', 'createdAt', 'userId'],
    };

    query.limit = (req.query.limit > 0) ? req.query.limit : 10;

    query.offset = (req.query.offset > 0) ? req.query.offset : 0;
    query.order = ['createdAt'];

    const ownerId = parseInt(req.params.id, 10);
    if (isNaN(ownerId)) {
      return res.status(400).send({
        errorMessage: 'Invalid parameter, user id can only be integer'
      });
    }

    if (req.decoded.user.roleId === 1) {
      return models.Document
        .findAndCountAll({
          where: {
            userId: req.params.id } })
            .then((documents) => {
              const pagination = Pagination.pages(
                query.limit, query.offset, documents.count
              );
              if (!documents.rows.length) {
                return res.status(404).send({
                  errorMessage: 'No user found',
                });
              }
              res.status(200).send({
                message: 'Retrieved documents successfully',
                documents,
                pagination
              });
            })
            .catch(err => res.status(400).send({
              err: err.toString(),
              errorMessage: 'Invalid parameter, user id can only be integer'
            }));
    }

    return models.Document
    .findAndCountAll({
      where: {
        userId: req.params.id,
        $or: [
         { access: 'public' },
         { access: 'role', roleId: req.decoded.user.roleId },
         { $and: [{ access: 'private' }, { userId: req.decoded.user.userId }] }
        ]
      },
      attributes: ['id', 'title', 'access', 'content', 'createdAt']
    })
    .then((documents) => {
      const pagination = Pagination.pages(
        query.limit, query.offset, documents.count
      );
      if (!documents.rows.length) {
        return res.status(404).send({
          errorMessage: 'No user found',
        });
      }
      res.status(200).send({
        message: 'Retrieved documents successfully',
        documents,
        pagination
      });
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
    const ownerId = parseInt(req.params.id, 10);
    if (isNaN(ownerId)) {
      return res.status(400).send({
        errorMessage: 'Invalid parameter, document id can only be integer'
      });
    }
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
        const pagination = Pagination.pages(
          query.limit, query.offset, documents.count
        );
        if (!documents.rows.length) {
          return res.status(404).send({
            error: 'Search term did not match any document',
          });
        }
        res.status(200).send({
          message: 'Retrieved documents successfully',
          documents: documents.rows,
          pagination
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
        const pagination = Pagination.pages(
          query.limit, query.offset, documents.count
        );
        if (!documents.rows.length) {
          return res.status(404).send({
            error: 'Search term does not match any document',
          });
        }
        res.status(200).send({
          message: 'Retrieved documents successfully',
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
    if (Validator.verifyId(req.params.id)) {
      return models.Document
      .findOne({
        where: {
          id: req.params.id,
        }
      }).then((document) => {
        if (document === null || document.length === 0) {
          return res.status(404).send({
            errorMessage: 'Can not delete a document that  does not exist'
          });
        }
        if ((req.decoded.user.userId === document.userId) || req.decoded.user.roleId === 1) {
          document.destroy({
            where: {
              id: req.params.id,
            }
          })
          .then(() => {
            const deletedDocument = {
              message: 'Document deleted successfully',
            };
            return res.send(deletedDocument);
          })
          .catch((error) => {
            res.status(412).json({ msg: error.message });
          });
        } else {
          res.status(403).send({
            errorMessage: 'You can not delete other user document'
          });
        }
      });
    }
    res.status(400).send({
      errorMessage: 'the document id must be an integer'
    });
  }
};
