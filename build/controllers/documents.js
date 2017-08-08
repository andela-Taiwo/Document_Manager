'use strict';

var Document = require('../models').Document;
var Role = require('../models').Role;
var verifyDocParams = require('../helper/profile.js').verifyDocParams;
var Helper = require('../helper/pagination');

module.exports = {

  /**
   *@param {object} req
   * @param {object} res
   * @return {json}  Document
   * */
  addDocument: function addDocument(req, res) {
    verifyDocParams(req).then(function (result) {
      var verifiedParams = result.mapped();
      var noErrors = result.isEmpty();
      if (noErrors === false) {
        return res.status(412).json({ message: verifiedParams });
      }
      return Document.create({
        title: req.body.title,
        content: req.body.content,
        access: req.body.access,
        userId: req.decoded.user.userId,
        roleId: req.decoded.user.roleId
      }).then(function (document) {
        return res.status(201).json({
          title: document.title,
          message: 'New Document created successfully',
          ownerId: document.userId });
      }).catch(function (error) {
        return res.status(412).json({ msg: error });
      });
    });
  },

  /**
   *@param {object} req
   * @param {object} res
   * @return {json}  document
   * */
  getDocument: function getDocument(req, res) {
    Role.findById(req.decoded.user.roleId).then(function (role) {
      if (req.decoded.user.roleId === 1) {
        return Document.findById(req.params.id).then(function (documents) {
          return res.status(201).send(documents);
        }).catch(function (err) {
          return res.status(404).send(err.toString());
        });
      }
      return Document.findOne({
        where: {
          id: req.params.id,
          access: [role.roleType, 'public'] },
        attributes: ['id', 'title', 'access', 'content', 'createdAt']
      }).then(function (documents) {
        if (documents) {
          res.status(201).send(documents);
        }
      }).catch(function (err) {
        return res.status(404).send({
          err: err.toString(),
          message: 'No document found'
        });
      });
    });
  },

  /**
   *@param {object} req
   * @param {object} res
   * @return {json}  Document
   * */

  getAllDocuments: function getAllDocuments(req, res) {
    var query = req.query;
    Role.findById(req.decoded.user.roleId).then(function (role) {
      if (req.decoded.user.roleId === 1) {
        return Document.findAll({
          attributes: ['id', 'title', 'content', 'access', 'createdAt'],
          offset: query.offset || 0,
          limit: query.limit || 10
        }).then(function (documents) {
          if (documents.length === 0) {
            return res.status(404).send({
              message: 'Document not found'
            });
          }
          res.status(201).send(documents);
        }).catch(function () {
          return res.status(400).send('Connection Error');
        });
      }
      return Document.findAll({
        where: { access: [role.roleType, 'public'] },
        attributes: ['id', 'title', 'access', 'content', 'createdAt'],
        offset: query.offset || 0,
        limit: query.limit || 10
      }).then(function (documents) {
        if (documents.length === 0) {
          return res.status(404).send({
            message: 'Document not found'
          });
        }
        res.status(201).send(documents);
      }).catch(function (err) {
        return res.status(400).send(err.toString());
      });
    });
  },
  getUserDocuments: function getUserDocuments(req, res) {
    Role.findById(req.decoded.user.roleId).then(function (role) {
      if (req.decoded.user.roleId === 1) {
        return Document.findAll({
          where: {
            userId: req.params.id } }).then(function (documents) {
          if (documents.length === 0) {
            return res.status(404).send({
              message: 'Document not found'
            });
          }
          res.status(201).send(documents);
        }).catch(function (err) {
          return res.status(400).send(err.toString());
        });
      }
      return Document.findAll({
        where: {
          userId: req.params.id,
          access: [role.roleType, 'public'] },
        attributes: ['id', 'title', 'access', 'content', 'createdAt']
      }).then(function (documents) {
        return res.status(201).send(documents);
      }).catch(function (err) {
        return res.status(400).send({
          err: err.toString(),
          message: 'Invalid parameter, user id can only be integer'
        });
      });
    });
  },

  /**
   *@param {object} req
   * @param {object} res
   * @return {json}  document
   * */

  updateDocument: function updateDocument(req, res) {
    return Document.findOne({
      where: {
        userId: req.decoded.user.userId,
        id: req.params.id
      }
    }).then(function (document) {
      if (req.decoded.user.userId === document.userId) {
        document.update({
          title: req.body.title || document.title,
          content: req.body.content || document.content,
          userId: req.decoded.user.userId,
          access: req.body.access || document.access,
          roleId: req.decoded.user.roleId
        }).then(function (documentUpdate) {
          var updatedDocument = {
            error: 'false',
            message: 'Updated document successfully',
            updatedDocument: documentUpdate
          };
          res.send(updatedDocument);
        });
      }
    }).catch(function (error) {
      res.status(412).json({ msg: error.message });
    });
  },


  /**
   *@param {object} req
   * @param {object} res
   * @return {json}  documents
   * */

  searchAllDocuments: function searchAllDocuments(req, res) {
    var searchTerm = req.query.q.trim();
    var query = {
      where: {

        title: {
          $iLike: '%' + searchTerm + '%'
        }

      }
    };

    query.limit = req.query.limit > 0 ? req.query.limit : 10;
    query.offset = req.query.offset > 0 ? req.query.offset : 0;
    query.order = ['createdAt'];
    return Document.findAndCountAll(query).then(function (documents) {
      var pagination = Helper.pagination(query.limit, query.offset, documents.count);
      if (!documents.rows.length) {
        return res.status(404).send({
          message: 'Search term does not match any document'
        });
      }
      res.status(201).send({
        pagination: pagination, documents: documents.rows
      });
    }).catch(function (error) {
      res.status(412).json({ msg: error.message });
    });
  },


  /**
   *@param {object} req
   * @param {object} res
   * @return {json}  document
   * */
  deleteDocument: function deleteDocument(req, res) {
    return Document.findOne({
      where: {
        userId: req.decoded.user.userId,
        id: req.params.id
      }
    }).then(function (document) {
      if (req.decoded.user.userId === document.userId) {
        document.destroy({
          where: {
            id: req.params.id,
            userId: req.decoded.user.userId
          }
        });
      }
    }).then(function (deleteDocument) {
      var deletedDocument = {
        error: 'false',
        message: 'Deleted document successfully',
        deletedDocument: deleteDocument
      };
      res.send(deletedDocument);
    }).catch(function (error) {
      res.status(412).json({ msg: error.message });
    });
  }
};