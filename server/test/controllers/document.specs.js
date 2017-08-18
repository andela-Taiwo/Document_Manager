
import { expect } from 'chai';
import supertest from 'supertest';
import 'babel-register';
import auth from '../../helper/auth';
import mockData from '../mockData/mockData';
import app from '../../../build/server';

const adminToken = auth.setUserToken(mockData.admin);
const badToken = mockData.badToken;

const regularToken = auth.setUserToken(mockData.user);
const request = supertest(app);

describe(' Document', () => {
  describe('create documents', () => {
    it('should return a message document created successfully', (done) => {
      request.post('/api/v1/documents')
      .send({ title: 'johnDoe@yahoo.com',
        content: 'humanity',
        access: 'public' }
      )
      .set({ Authorization: `${regularToken}` })
      .end((err, res) => {
        expect(res.body.message).to
        .be.equal('New Document created successfully');
        expect(res.statusCode).to.be.equal(201);
        done();
      });
    });

    it(`should return error message when user try to create
      a document with no content`, (done) => {
      request.post('/api/v1/documents')
      .send({ title: 'johnDoe@yahoo.com', access: 'public' })
      .set({ Authorization: `${regularToken}` })
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(412);
        done();
      });
    });
  });
  describe('fetches documents', () => {
    it('should return an  object containing  all documents', (done) => {
      request.get('/api/v1/documents/')
    .set({ Authorization: regularToken })
    .end((err, res) => {
      expect(res.statusCode).to.be.equal(200);
      done();
    });
    });

    it('should return an  object containing  a single document', (done) => {
      request.get('/api/v1/documents/9')
    .set({ Authorization: regularToken })
    .end((err, res) => {
      expect(res.status).to.be.equal(200);
      done();
    });
    });

    it('should return forbidden error message when user access private document'
    , (done) => {
      request.get('/api/v1/documents/1')
    .set({ Authorization: regularToken })
    .end((err, res) => {
      expect(res.status).to.be.equal(403);
      expect(res.body.errorMessage).to.be
      .equal('You are not authorized to view this document');
      done();
    });
    });

    it('should return all documents for super admin ',
     (done) => {
       request.get('/api/v1/documents/?limit=5&offset=0')
            .set({ Authorization: adminToken })
            .end((err, res) => {
              expect(res.status).to.be.equal(200);
              done();
            });
     });

    it('should return a document that matched the id for super admin ',
      (done) => {
        request.get('/api/v1/documents/1')
             .set({ Authorization: adminToken })
             .end((err, res) => {
               expect(res.status).to.be.equal(200);
               done();
             });
      });

    it('should return error message for invalid parameter',
      (done) => {
        request.get('/api/v1/documents/eeyey')
             .set({ Authorization: adminToken })
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

    it('should return all documents that belongs to a user to an admin',
      (done) => {
        request.get('/api/v1/users/1/documents')
             .set({ Authorization: adminToken })
             .end((err, res) => {
               expect(res.status).to.be.equal(200);
               done();
             });
      });

    it('should return all documents that belongs to a user to an regular user',
      (done) => {
        request.get('/api/v1/users/1/documents')
             .set({ Authorization: regularToken })
             .end((err, res) => {
               expect(res.status).to.be.equal(200);
               done();
             });
      });

    it('should return error message when invalid parameter is supplied for user id',
      (done) => {
        request.get('/api/v1/users/a/documents')
             .set({ Authorization: regularToken })
             .end((err, res) => {
               expect(res.status).to.be.equal(400);
               expect(res.body.errorMessage).to
               .be.equal('Invalid parameter, user id can only be integer');
               done();
             });
      });

    it('should return all 404 error if user id doesnot exist ',
        (done) => {
          request.get('/api/v1/users/6/documents')
               .set({ Authorization: adminToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(404);
                 expect(res.body.errorMessage).to.be
                 .equal('Document not found');
                 done();
               });
        });
    it('should return all 404 error if user id doesnot exist ',
        (done) => {
          request.get('/api/v1/users/6/documents')
               .set({ Authorization: regularToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(404);
                 expect(res.body.errorMessage).to.be
                 .equal('Document not found');
                 done();
               });
        });
  });
  describe('update documents', () => {
    it('should return a message document updated successfully', (done) => {
      request.put('/api/v1/documents/8')
      .send({ title: 'update my doc',
        content: 'Updating document ',
        access: 'role' })
      .set({ Authorization: `${regularToken}` })
      .end((err, res) => {
        expect(res.body.message).to.be.equal('Updated document successfully');
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });
    it('should return error message ', (done) => {
      request.put('/api/v1/documents/8')
      .send({ title: 'update my another user doc',
        content: 'Should not update ',
        access: 'role' })
      .set({ Authorization: `${adminToken}` })
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(412);
        done();
      });
    });
  });

  describe(' Documents search', () => {
    it('should return all documents that match the search term  ',
        (done) => {
          request.get('/api/v1/search/documents/?q=update my doc')
               .set({ Authorization: adminToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(200);
                 done();
               });
        });

    it('should return all documents that match the search term with pagination ',
        (done) => {
          request
          .get('/api/v1/search/documents/?q=update my doc&limit=4&offset=0')
               .set({ Authorization: adminToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(200);
                 done();
               });
        });
    it(`should return all documents that match the search term \n
        with pagination for user `,
        (done) => {
          request
          .get('/api/v1/search/documents/?q=update my doc&limit=4&offset=0')
               .set({ Authorization: regularToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(200);
                 done();
               });
        });

    it('should return 404 error when no document matches the search term  ',
        (done) => {
          request.get('/api/v1/search/documents/?q=history')
               .set({ Authorization: adminToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(404);
                 done();
               });
        });
  });

  describe(' Delete  document', () => {
    it('should delete the document',
        (done) => {
          request.delete('/api/v1/documents/9')
               .set({ Authorization: adminToken })
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
               .set({ Authorization: regularToken })
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
               .set({ Authorization: regularToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(200);
                 expect(res.body.message).to
                 .be.equal('Document deleted successfully');
                 done();
               });
        });
    it('should return  error message for non existence id ',
        (done) => {
          request.delete('/api/v1/documents/100')
               .set({ Authorization: adminToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(404);
                 expect(res.body.errorMessage).to
                 .be.equal('Can not delete a document that  does not exist');
                 done();
               });
        });
    it('should return  error message for invalid parameter id ',
        (done) => {
          request.delete('/api/v1/documents/eds')
               .set({ Authorization: adminToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(400);
                 expect(res.body.errorMessage).to
                 .be.equal('the document id must be an integer');
                 done();
               });
        });

    it('should return 404 error when user try to access deleted document  ',
        (done) => {
          request.get('/api/v1/documents/9')
               .set({ Authorization: adminToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(404);
                 done();
               });
        });
  });
});
