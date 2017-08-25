
import { expect } from 'chai';
import supertest from 'supertest';
import 'babel-register';
import auth from '../../helper/auth';
import mockData from '../mockData/mockData';
import app from '../../../build/server';

const superAdminToken = auth.setUserToken(mockData.superAdmin);
const badToken = mockData.badToken;

const userToken = auth.setUserToken(mockData.user);
const request = supertest(app);

describe('Documents', () => {
  describe('CreateDocuments function', () => {
    it(`should return success message when a user makes a request to create
      a new document`, (done) => {
      request.post('/api/v1/documents')
      .send({ title: 'johnDoe@yahoo.com',
        content: 'humanity',
        access: 'public' }
      )
      .set({ Authorization: `${userToken}` })
      .end((err, res) => {
        expect(res.body.message).to.be.equal('New Document created successfully');
        expect(res.statusCode).to.be.equal(201);
        expect(res.body).to.be.an('object');
        done();
      });
    });

    it(`should return error message with status code 400 when user makes a
      request to create a document with  access value that does not exist in
      the database`, (done) => {
      request.post('/api/v1/documents')
      .send({ title: 'johnDoe@yahoo.com',
        content: 'humanity',
        access: 'publics' }
      )
      .set({ Authorization: `${userToken}` })
      .end((err, res) => {
        expect(res.body.errorMessage).to.be.equal('Invalid access parameter');
        expect(res.statusCode).to.be.equal(400);
        expect(res.body).to.be.an('object').to.include.any.keys('errorMessage');
        done();
      });
    });

    it(`should return error message with status code 400 when a user makes a
      request to create a document with a title that already exist `, (done) => {
      request.post('/api/v1/documents')
      .send({ title: 'Django lady',
        content: 'duplicate',
        access: 'public' }
      )
      .set({ Authorization: `${userToken}` })
      .end((err, res) => {
        expect(res.body).to.be.an('object').to.include.any.keys('errorMessage');
        expect(res.statusCode).to.be.equal(400);
        expect(res.body.errorMessage).to
        .be.equal('Document already exist with the title Django lady');
        done();
      });
    });

    it(`should return error message with status code 412 when user makes a
       request to create document with empty content `, (done) => {
      request.post('/api/v1/documents')
      .send({ title: 'johnDoe@yahoo.com', access: 'public' })
      .set({ Authorization: `${userToken}` })
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(412);
        expect(res.body.errorMessage.content.errorMessage).to.be
        .equal('Document content cannot be empty');
        expect(res.body).to.be.an('object').to.include.any.keys('errorMessage');
        done();
      });
    });
  });
  describe('Get all documents function ', () => {
    it(`should return documents that match the access value when a user
      makes a request to get all documents`, (done) => {
      request.get('/api/v1/documents/')
    .set({ Authorization: userToken })
    .end((err, res) => {
      expect(res.statusCode).to.be.equal(200);
      expect(res.body.returnedDocument).to.be.equal(6);
      expect(res.body.message).to.be
      .equal('Retrieved documents successfully');
      expect(res.body).to.be.an('object').to.not
      .include.any.keys('errorMessage');
      expect(res.body).to.include.any.keys('message');
      done();
    });
    });

    it(`should return all documents when a super admin makes a request
       to get all documents`,
     (done) => {
       request.get('/api/v1/documents')
            .set({ Authorization: superAdminToken })
            .end((err, res) => {
              expect(res.body.returnedDocument).to.be.equal(10);
              expect(res.status).to.be.equal(200);
              expect(res.body.message).to.be
              .equal('Documents retrieved succesfully');
              done();
            });
     });
  });

  describe('Get a document', () => {
    it(`should return a single document when a user makes a request to
      get a document`, (done) => {
      request.get('/api/v1/documents/9')
    .set({ Authorization: userToken })
    .end((err, res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body.message).to.be.equal('Retrieved document succesfully');
      expect(res.body.document.count).to.be.equal(1);
      expect(res.body).to.include.any.keys('message', 'document');
      expect(res.body.document.rows[0]).to.include
      .any.keys('id', 'title', 'access', 'content');
      expect(res.body.document.rows[0].id).to.equal(9);
      done();
    });
    });

    it(`should return error message with status code 403  when a
      user makes a request to get another user private document`
    , (done) => {
      request.get('/api/v1/documents/1')
    .set({ Authorization: userToken })
    .end((err, res) => {
      expect(res.status).to.be.equal(403);
      expect(res.body).to.be.an('object').to.include.any.keys('errorMessage');
      expect(res.body.errorMessage).to.be
      .equal('You are not authorized to view this document');
      done();
    });
    });

    it(`should return a single document when a user makes a request
       to get a document`,
      (done) => {
        request.get('/api/v1/documents/1')
             .set({ Authorization: superAdminToken })
             .end((err, res) => {
               expect(res.body.document.count).to.be.equal(1);
               expect(res.status).to.be.equal(200);
               expect(res.body.message).to.be
               .equal('Retrieved document succesfully');
               expect(res.body).to.be.an('object').to
               .include.any.keys('message');
               expect(res.body.document.rows[0].id).to.equal(1);
               done();
             });
      });

    it(`should return error message with status code 400 when a super admin
    makes a request to a get document with a string as id parameter`,
      (done) => {
        request.get('/api/v1/documents/eeyey')
             .set({ Authorization: superAdminToken })
             .end((err, res) => {
               expect(res.status).to.be.equal(400);
               expect(res.body.errorMessage).to.be
               .equal('Invalid parameter, document id can only be integer');
               expect(res.body).to.be.an('object').to
               .include.any.keys('errorMessage');
               done();
             });
      });


    it('should return 403 forbidden error message when user has not logged in ',
     (done) => {
       request.get('/api/v1/documents')
            .set({ Authorization: badToken })
            .end((err, res) => {
              expect(res.status).to.be.equal(403);
              expect(res.body.errorMessage).to.be.equal('You are not signed in');
              expect(res.body).to.be.an('object').to.include
              .any.keys('errorMessage');
              done();
            });
     });
  });

  describe('Get a user documents function', () => {
    it(`should return all documents  belonging to a user when a super
       admin makes a request`,
      (done) => {
        request.get('/api/v1/users/1/documents')
             .set({ Authorization: superAdminToken })
             .end((err, res) => {
               expect(res.status).to.be.equal(200);
               expect(res.body).to.be.an('object').to.include.any
               .keys('message');
               expect(res.body.message).to.be
               .equal('Retrieved documents successfully');
               expect(res.body.documents.count).to.be.equal(3);
               done();
             });
      });

    it(`should return selected documents that match the documents access value
       when a user makes a request `,
      (done) => {
        request.get('/api/v1/users/1/documents')
             .set({ Authorization: userToken })
             .end((err, res) => {
               expect(res.status).to.be.equal(200);
               expect(res.body.documents.count).to.be.equal(1);
               expect(res.body).to.be.an('object').to.include.any
               .keys('message');
               expect(res.body.message).to.be
               .equal('Retrieved documents successfully');
               expect(res.body).to.be.an('object').to
               .include.any.keys('message');
               expect(res.body.documents.rows[0].id).to.equal(2);
               expect(res.body.documents.rows[0].access).to.equal('public');
               done();
             });
      });

    it(`should return error message with status code 400  when a user makes
      request with invalid id parameter`,
      (done) => {
        request.get('/api/v1/users/a/documents')
             .set({ Authorization: userToken })
             .end((err, res) => {
               expect(res.status).to.be.equal(400);
               expect(res.body).to.be.an('object').to.include
               .any.keys('errorMessage');
               expect(res.body.errorMessage).to
               .be.equal('Invalid parameter, user id can only be integer');
               done();
             });
      });

    it(`should return error message with status code 404 when a super admin
      makes a request for documents from a user that does not exist`,
        (done) => {
          request.get('/api/v1/users/6/documents')
               .set({ Authorization: superAdminToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(404);
                 expect(res.body).to.be.an('object').to.include
                 .any.keys('errorMessage');
                 expect(res.body.errorMessage).to.be
                 .equal('No user found');
                 done();
               });
        });
    it(`should return error message with status code 404,when a user
       makes a request for documents from user that does not exist`,
        (done) => {
          request.get('/api/v1/users/6/documents')
               .set({ Authorization: userToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(404);
                 expect(res.body).to.be.an('object').to.include
                 .any.keys('errorMessage');
                 expect(res.body.errorMessage).to.be
                 .equal('No user found');
                 done();
               });
        });
  });
  describe('update documents function', () => {
    it(`should return a success message when the user
      makes a request to update personal document`, (done) => {
      request.put('/api/v1/documents/8')
      .send({ title: 'update my doc',
        content: 'Updating document ',
        access: 'role' })
      .set({ Authorization: `${userToken}` })
      .end((err, res) => {
        expect(res.body).to.be.an('object').to.include
        .any.keys('message', 'document');
        expect(res.body.message).to.be.equal('Updated document successfully');
        expect(res.statusCode).to.be.equal(200);
        expect(res.body.updatedDocument.id).to.be.equal(8);
        expect(res.body.updatedDocument.userId).to.be.equal(3);
        done();
      });
    });
    it(`should return error message  with status code 412 when super admin
      makes a request to update another user document`, (done) => {
      request.put('/api/v1/documents/8')
      .send({ title: 'update my another user doc',
        content: 'Should not update ',
        access: 'role' })
      .set({ Authorization: `${superAdminToken}` })
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(412);
        expect(res.body).to.be.an('object').to.include
        .any.keys('errorMessage');
        expect(res.body.errorMessage).to
        .be.equal('You are not authorized to update another user documents');
        done();
      });
    });
  });

  describe(' Documents search function', () => {
    it(`should return all documents that match the search query when super admin
       makes a request to search for a document title `,
        (done) => {
          request.get('/api/v1/search/documents/?q=update my doc')
               .set({ Authorization: superAdminToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(200);
                 expect(res.body.returnedDocument).to.be.equal(1);
                 expect(res.body).to.be.an('object').to.include
                 .any.keys('message', 'returnedDocument');
                 expect(res.body.message).to.be
                 .equal('Retrieved documents successfully');
                 done();
               });
        });

    it(`should return all documents with pagination when a super admin makes a
      request to get documents  with limit or offset parameter`,
        (done) => {
          request
          .get('/api/v1/search/documents/?q=update my doc&limit=4&offset=0')
               .set({ Authorization: superAdminToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(200);
                 expect(res.body.message).to.be
                 .equal('Retrieved documents successfully');
                 expect(res.body.pagination.pageCount).to.be.equal(1);
                 expect(res.body.pagination.totalCount).to.be.equal(1);
                 expect(res.body.pagination.pageSize).to.be.equal(1);
                 done();
               });
        });
    it(`should return all documents with pagination when a user makes a
      request to get documents  with limit or offset parameter `,
        (done) => {
          request
          .get('/api/v1/search/documents/?q=update my doc&limit=4&offset=0')
               .set({ Authorization: userToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(200);
                 expect(res.body).to.be.an('object').to.include
                 .any.keys('message', 'returnedDocuments', 'pagination');
                 expect(res.body.message).to.be
                 .equal('Retrieved documents successfully');
                 expect(res.body.pagination.pageCount).to.be.equal(1);
                 expect(res.body.pagination.totalCount).to.be.equal(1);
                 expect(res.body.pagination.pageSize).to.be.equal(1);
                 done();
               });
        });

    it(`should return error message with status code 404 when  a user makes
       a request to search for a document title that does not exist `,
        (done) => {
          request.get('/api/v1/search/documents/?q=history')
               .set({ Authorization: superAdminToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(404);
                 expect(res.body).to.be.an('object').to.include
                 .any.keys('errorMessage');
                 expect(res.body.errorMessage).to.be
                 .equal('Search term did not match any document');
                 done();
               });
        });
  });
  describe('pagination', () => {
    it(`should return all documents with pagination when a super admin makes a
    request to get all documuents `,
     (done) => {
       request.get('/api/v1/documents/?limit=5&offset=0')
            .set({ Authorization: superAdminToken })
            .end((err, res) => {
              expect(res.status).to.be.equal(200);
              expect(res.body).to.be.an('object').to.include
              .any.keys('message', 'returnedDocument', 'pagination');
              expect(res.body.message).to.be
              .equal('Documents retrieved succesfully');
              expect(res.body.pagination.totalCount).to.be.equal(10);
              expect(res.body.pagination.currentPage).to.be.equal(1);
              expect(res.body.pagination.pageSize).to.be.equal(5);
              done();
            });
     });
  });
  describe(' Delete  document', () => {
    it(`should delete the document when a super admin makes a request to
       delete a document`,
        (done) => {
          request.delete('/api/v1/documents/9')
               .set({ Authorization: superAdminToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(200);
                 expect(res.body).to.be.an('object').to.include
                 .any.keys('message');
                 expect(res.body.message).to.be
                 .equal('Document deleted successfully');
                 done();
               });
        });

    it(`should return error message with status code 403 when a user makes a
      request to delete another user document`,
        (done) => {
          request.delete('/api/v1/documents/1')
               .set({ Authorization: userToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(403);
                 expect(res.body).to.be.an('object').to.include
                 .any.keys('errorMessage');
                 expect(res.body.errorMessage).to.be
                 .equal('You can not delete other user document');
                 done();
               });
        });

    it(`should return  a  success message when a user makes a request to
       delete personal document`,
        (done) => {
          request.delete('/api/v1/documents/7')
               .set({ Authorization: userToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(200);
                 expect(res.body).to.be.an('object').to.include
                 .any.keys('message');
                 expect(res.body.message).to
                 .be.equal('Document deleted successfully');
                 done();
               });
        });
    it(`should return  error message with status code 404, when a super admin
      makes a request to delete a document that does not exist `,
        (done) => {
          request.delete('/api/v1/documents/100')
               .set({ Authorization: superAdminToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(404);
                 expect(res.body.errorMessage).to
                 .be.equal('Can not delete a document that  does not exist');
                 done();
               });
        });
    it(`should return  error message with status code 400, when a super admin
      makes a request with an invalid id parameter `,
        (done) => {
          request.delete('/api/v1/documents/eds')
               .set({ Authorization: superAdminToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(400);
                 expect(res.body.errorMessage).to
                 .be.equal('the document id must be an integer');
                 done();
               });
        });

    it(`should return message with status code  404 when a user makes a request
       to get a deleted document `,
        (done) => {
          request.get('/api/v1/documents/9')
               .set({ Authorization: superAdminToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(404);
                 expect(res.body).to.be.an('object').to.include
                 .any.keys('errorMessage');
                 expect(res.body.errorMessage).to.be.equal('Document not found');
                 done();
               });
        });
  });
});
