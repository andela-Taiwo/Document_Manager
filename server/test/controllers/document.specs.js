
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

describe(' Document', () => {
  describe('create documents function', () => {
    it('should return a message document created successfully', (done) => {
      request.post('/api/v1/documents')
      .send({ title: 'johnDoe@yahoo.com',
        content: 'humanity',
        access: 'public' }
      )
      .set({ Authorization: `${userToken}` })
      .end((err, res) => {
        expect(res.body.message).to.be.equal('New Document created successfully');
        expect(res.statusCode).to.be.equal(201);
        done();
      });
    });

    it(`should return error message with status code 400 for invalid
      access condition`, (done) => {
      request.post('/api/v1/documents')
      .send({ title: 'johnDoe@yahoo.com',
        content: 'humanity',
        access: 'publics' }
      )
      .set({ Authorization: `${userToken}` })
      .end((err, res) => {
        expect(res.body.errorMessage).to.be.equal('Invalid access parameter');
        expect(res.statusCode).to.be.equal(400);
        done();
      });
    });

    it(`should return error message with status code 400 if the document title
      already exist`, (done) => {
      request.post('/api/v1/documents')
      .send({ title: 'Django lady',
        content: 'duplicate',
        access: 'public' }
      )
      .set({ Authorization: `${userToken}` })
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(400);
        expect(res.body.errorMessage).to.be.equal('Document already exist');
        done();
      });
    });

    it(`should return error message with status code 412 when user tries
      to create a document with no content`, (done) => {
      request.post('/api/v1/documents')
      .send({ title: 'johnDoe@yahoo.com', access: 'public' })
      .set({ Authorization: `${userToken}` })
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(412);
        done();
      });
    });
  });
  describe('get all documents function ', () => {
    it(`should return an  object containing  all documents that match user role
      or document access condition , when is a user`, (done) => {
      request.get('/api/v1/documents/')
    .set({ Authorization: userToken })
    .end((err, res) => {
      expect(res.statusCode).to.be.equal(200);
      done();
    });
    });

    it('should return all documents to super admin ',
     (done) => {
       request.get('/api/v1/documents')
            .set({ Authorization: superAdminToken })
            .end((err, res) => {
              expect(res.status).to.be.equal(200);
              expect(res.body.message).to.be
              .equal('Documents retrieved succesfully');
              done();
            });
     });
  });

  describe('get a document', () => {
    it(`should return an  object containing  a single document
       if it matches user role or document access condition`, (done) => {
      request.get('/api/v1/documents/9')
    .set({ Authorization: userToken })
    .end((err, res) => {
      expect(res.status).to.be.equal(200);
      done();
    });
    });

    it(`should return forbidden error message when a user tries to
      access  another user private document`
    , (done) => {
      request.get('/api/v1/documents/1')
    .set({ Authorization: userToken })
    .end((err, res) => {
      expect(res.status).to.be.equal(403);
      expect(res.body.errorMessage).to.be
      .equal('You are not authorized to view this document');
      done();
    });
    });

    it('should return a document that matched the id for super admin ',
      (done) => {
        request.get('/api/v1/documents/1')
             .set({ Authorization: superAdminToken })
             .end((err, res) => {
               expect(res.status).to.be.equal(200);
               done();
             });
      });

    it('should return error message for invalid parameter',
      (done) => {
        request.get('/api/v1/documents/eeyey')
             .set({ Authorization: superAdminToken })
             .end((err, res) => {
               expect(res.status).to.be.equal(400);
               expect(res.body.errorMessage).to.be
               .equal('Invalid parameter, document id can only be integer');
               done();
             });
      });


    it('should return 403 forbidden error message when user is not logged ',
     (done) => {
       request.get('/api/v1/documents')
            .set({ Authorization: badToken })
            .end((err, res) => {
              expect(res.status).to.be.equal(403);
              expect(res.body.message).to.be.equal('You are not signed in');
              done();
            });
     });
  });

  describe('get a user documents function', () => {
    it('should return all documents that belongs to a user to an admin',
      (done) => {
        request.get('/api/v1/users/1/documents')
             .set({ Authorization: superAdminToken })
             .end((err, res) => {
               expect(res.status).to.be.equal(200);
               done();
             });
      });

    it(`should return all documents that belongs to another user if they match
      user's role or the document's access condition`,
      (done) => {
        request.get('/api/v1/users/1/documents')
             .set({ Authorization: userToken })
             .end((err, res) => {
               expect(res.status).to.be.equal(200);
               done();
             });
      });

    it('should return error message when invalid parameter is supplied for user id',
      (done) => {
        request.get('/api/v1/users/a/documents')
             .set({ Authorization: userToken })
             .end((err, res) => {
               expect(res.status).to.be.equal(400);
               expect(res.body.errorMessage).to
               .be.equal('Invalid parameter, user id can only be integer');
               done();
             });
      });

    it('should return all 404 error if user id does not exist ',
        (done) => {
          request.get('/api/v1/users/6/documents')
               .set({ Authorization: superAdminToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(404);
                 expect(res.body.errorMessage).to.be
                 .equal('No user found');
                 done();
               });
        });
    it(`should return error message with status code 404,
      if user id does not exist`,
        (done) => {
          request.get('/api/v1/users/6/documents')
               .set({ Authorization: userToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(404);
                 expect(res.body.errorMessage).to.be
                 .equal('No user found');
                 done();
               });
        });
  });
  describe('update documents function', () => {
    it('should return a message document updated successfully', (done) => {
      request.put('/api/v1/documents/8')
      .send({ title: 'update my doc',
        content: 'Updating document ',
        access: 'role' })
      .set({ Authorization: `${userToken}` })
      .end((err, res) => {
        expect(res.body.message).to.be.equal('Updated document successfully');
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });
    it('should return error message  with status code 412', (done) => {
      request.put('/api/v1/documents/8')
      .send({ title: 'update my another user doc',
        content: 'Should not update ',
        access: 'role' })
      .set({ Authorization: `${superAdminToken}` })
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(412);
        done();
      });
    });
  });

  describe(' Documents search function', () => {
    it('should return all documents that match the search term if is a super admin  ',
        (done) => {
          request.get('/api/v1/search/documents/?q=update my doc')
               .set({ Authorization: superAdminToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(200);
                 expect(res.body.message).to.be
                 .equal('Retrieved documents successfully');
                 done();
               });
        });

    it('should return all documents that match the search term with pagination ',
        (done) => {
          request
          .get('/api/v1/search/documents/?q=update my doc&limit=4&offset=0')
               .set({ Authorization: superAdminToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(200);
                 expect(res.body.message).to.be
                 .equal('Retrieved documents successfully');
                 done();
               });
        });
    it(`should return all documents that match the search term \n
        with pagination for user `,
        (done) => {
          request
          .get('/api/v1/search/documents/?q=update my doc&limit=4&offset=0')
               .set({ Authorization: userToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(200);
                 done();
               });
        });

    it(`should return error message with status code 404
       when no document matches the search term `,
        (done) => {
          request.get('/api/v1/search/documents/?q=history')
               .set({ Authorization: superAdminToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(404);
                 done();
               });
        });
  });
  describe('pagination', () => {
    it('should return all documents with pagination if  is a super admin ',
     (done) => {
       request.get('/api/v1/documents/?limit=5&offset=0')
            .set({ Authorization: superAdminToken })
            .end((err, res) => {
              expect(res.status).to.be.equal(200);
              expect(res.body.pagination.totalCount).to.be.equal(10);
              expect(res.body.pagination.currentPage).to.be.equal(1);
              expect(res.body.pagination.pageSize).to.be.equal(5);
              done();
            });
     });
  });
  describe(' Delete  document', () => {
    it('should delete the document',
        (done) => {
          request.delete('/api/v1/documents/9')
               .set({ Authorization: superAdminToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(200);
                 expect(res.body.message).to.be
                 .equal('Document deleted successfully');
                 done();
               });
        });

    it('should return error message for unauthorize deletion ',
        (done) => {
          request.delete('/api/v1/documents/1')
               .set({ Authorization: userToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(403);
                 expect(res.body.errorMessage).to.be
                 .equal('You can not delete other user document');
                 done();
               });
        });

    it('should return  a message when a document is deleted  ',
        (done) => {
          request.delete('/api/v1/documents/7')
               .set({ Authorization: userToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(200);
                 expect(res.body.message).to
                 .be.equal('Document deleted successfully');
                 done();
               });
        });
    it(`should return  error message with status code 404,
       if id supplied is not found `,
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
    it(`should return  error message with status code 400,
      if the id is not a positive integer  `,
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

    it(`should return message with status code  404
      if  error when user tries to access deleted document `,
        (done) => {
          request.get('/api/v1/documents/9')
               .set({ Authorization: superAdminToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(404);
                 done();
               });
        });
  });
});
