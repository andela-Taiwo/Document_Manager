
import { expect } from 'chai';
import supertest from 'supertest';
import 'babel-register';
import auth from '../../server/helper/auth';

import mockData from '../../mockData/mockData';

const app = require('../../build/server');
const Role = require('../../build/models').Role;
const User = require('../../build/models').User;

const adminToken = auth.setUserToken(mockData.admin);
const badToken = mockData.badToken;

let regularToken;
const request = supertest(app);

describe(' Document', () => {
  describe('user', () => {
    beforeEach((done) => {
      User.destroy({
        where: {},
        truncate: true,
        cascade: true,
        restartIdentity: true
      })
  .then((err) => {
    if (!err) {
      Role.destroy({
        where: {},
        truncate: true,
        cascade: true,
        restartIdentity: true
      })
      .then((err) => {
        if (!err) {
          Role.bulkCreate([
            { roleType: 'super admin' },
            { roleType: 'admin' },
            { roleType: 'user' }
          ]).then(() => {
            done();
          });
        }
      });
    }
  });
    });

    describe('user signup', () => {
      it(`should return "User successfully signup" and status 201,
      when user tries to signup with valid data`, (done) => {
        request.post('/api/v1/users')
      .send({ email: 'john@yahoo.com', password: 'humanity', userName: 'adeola' })
      .end((err, res) => {
        expect((res.body.message)).to.be.equal('User successfully signup');
        expect((res.statusCode)).to.be.equal(201);
        done();
      });
      });
    });
  });

  describe(' Documents user in', () => {
    it('should return an  object containing  a token', (done) => {
      request.post('/api/v1/users/login')
      .send({ email: 'john@yahoo.com', password: 'humanity' })
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(201);
        regularToken = res.body.token;
        done();
      });
    });


    it('should return a message document created successfully', (done) => {
      request.post('/api/v1/documents')
      .send({ title: 'johnDoe@yahoo.com',
        content: 'humanity',
        access: 'public' })
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
  describe('user get documents', () => {
    it('should return an  object containing  all documents', (done) => {
      request.get('/api/v1/documents/')
    .set({ Authorization: regularToken })
    .end((err, res) => {
      expect(res.statusCode).to.be.equal(201);
      done();
    });
    });

    it('should return an  object containing  a single document', (done) => {
      request.get('/api/v1/documents/1')
    .set({ Authorization: regularToken })
    .end((err, res) => {
      expect(res.status).to.be.equal(201);
      done();
    });
    });

    it(`should return all documents
      for documents user when user has logged in `,
     (done) => {
       request.get('/api/v1/documents')
            .set({ Authorization: adminToken })
            .end((err, res) => {
              expect(res.status).to.be.equal(201);
              done();
            });
     });

    it(`should return a document that matched the id supplied
       by the user when user has logged in `,
      (done) => {
        request.get('/api/v1/documents/1')
             .set({ Authorization: adminToken })
             .end((err, res) => {
               expect(res.status).to.be.equal(201);
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
               expect(res.status).to.be.equal(201);
               done();
             });
      });

    it('should return all documents that belongs to a user to an regular user',
      (done) => {
        request.get('/api/v1/users/1/documents')
             .set({ Authorization: regularToken })
             .end((err, res) => {
               expect(res.status).to.be.equal(201);
               done();
             });
      });

    it('should return error message when invalid parameter is supplied for user id',
      (done) => {
        request.get('/api/v1/users/a/documents')
             .set({ Authorization: regularToken })
             .end((err, res) => {
               expect(res.status).to.be.equal(400);
               expect(res.body.message).to
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
                 expect(res.body.message).to.be.equal('Document not found');
                 done();
               });
        });
  });
  describe('update documents', () => {
    it('should return a message document updated successfully', (done) => {
      request.put('/api/v1/documents/1')
      .send({ title: 'update my doc',
        content: 'Updating document ',
        access: 'user' })
      .set({ Authorization: `${regularToken}` })
      .end((err, res) => {
        expect(res.body.message).to.be.equal('Updated document successfully');
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });
    it('should return error message ', (done) => {
      request.put('/api/v1/documents/1')
      .send({ title: 'update my doc',
        content: 'Updating document ',
        access: 'user' })
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
                 expect(res.status).to.be.equal(201);
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
    it(`should return 404 error when no
       document matches the id parameter supplied`,
        (done) => {
          request.delete('/api/v1/documents/1')
               .set({ Authorization: adminToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(412);
                 done();
               });
        });

    it('should return error message for unauthorize deletion ',
        (done) => {
          request.delete('/api/v1/documents/5')
               .set({ Authorization: regularToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(412);
                 done();
               });
        });

    it('should return  a message when a document is deleted  ',
        (done) => {
          request.delete('/api/v1/documents/1')
               .set({ Authorization: regularToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(200);
                 expect(res.body.message).to
                 .be.equal('Deleted document successfully');
                 done();
               });
        });

    it('should return 404 error when user try to access deleted document  ',
        (done) => {
          request.get('/api/v1/documents/1')
               .set({ Authorization: adminToken })
               .end((err, res) => {
                 expect(res.status).to.be.equal(201);
                 done();
               });
        });
  });
});
