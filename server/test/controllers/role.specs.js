import request from 'supertest';
import { expect } from 'chai';
import mockData from '../mockData/mockData';
import auth from '../../helper/auth';
import app from '../../../build/server';

const dotenv = require('dotenv');

dotenv.config();

const superAdminToken = auth.setUserToken(mockData.superAdmin);
const adminToken = auth.setUserToken(mockData.admin);
const userToken = auth.setUserToken(mockData.user);

describe('Role controller', () => {
  describe('create role function', () => {
    it(`should return error message with status code 403 when a user makes
      a request to create a role`, (done) => {
      request(app)
        .post('/api/v1/roles/')
        .send({
          roleType: 'Success'
        })
        .set('Authorization', userToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(403);
          }
          done();
        });
    });
    it(`should return success message when a super admin makes a request
      to create a new role`, (done) => {
      request(app)
        .post('/api/v1/roles/')
        .set('Authorization', superAdminToken)
        .send({
          roleType: 'Editor'
        })
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(201);
            expect(res.body.message).to.equal('successfully created role');
          }
          done();
        });
    });
    it(`should return error message with status code 400, when a super admin
      makes a request to create role with empty roleType parameter`, (done) => {
      request(app)
        .post('/api/v1/roles/')
        .set('Authorization', superAdminToken)
        .send({
        })
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(400);
            expect(res.body.errorMessage).to
          .equal('null value in column "roleType" violates not-null constraint');
          }
          done();
        });
    });

    it(`should return return error message when a super admin makes a
       request to create role without logging in`, (done) => {
      request(app)
        .post('/api/v1/roles/')
        .set('Authorization', '')
        .send({
          roleType: 'Unauthorize'
        })
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(412);
            expect(res.body.errorMessage).to.be
            .equal('You are not logged in. Please, login and try again');
          }
          done();
        });
    });
  });
  describe('Get roles function', () => {
    it(`should return error message with status code 403 if a user
      makes a request to get all roles`, (done) => {
      request(app)
        .get('/api/v1/roles/')
        .set('Authorization', userToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(403);
            expect(res.body.errorMessage)
            .to.equal('You are not authorized to view roles');
          }
          done();
        });
    });

    it(`should return success message when a super admin makes a
      request to get all roles`, (done) => {
      request(app)
        .get('/api/v1/roles/')
        .set('Authorization', superAdminToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(200);
            expect(res.body.message).to.be
            .equal('Retrieved roles successfully');
            expect(res.body.returnedRoles).to.be.equal(4);
          }
          done();
        });
    });
    it(`should return success message when an admin makes a request
       to get all roles`, (done) => {
      request(app)
        .get('/api/v1/roles/')
        .set('Authorization', adminToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(200);
            expect(res.body.message).to.be
            .equal('Retrieved roles successfully');
            expect(res.body.returnedRoles).to.be.equal(4);
          }
          done();
        });
    });
  });

  describe('Update role function', () => {
    it(`should return a success message when a super admin makes a
      request to update role `, (done) => {
      request(app)
        .put('/api/v1/roles/3')
        .send({
          roleType: 'Facilitator',

        })
        .set('Authorization', superAdminToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Role updated succesfully');
          }
          done();
        });
    });

    it(`should return errror message with status code 412, when a super admin
      makes a request to update a role with invalid role id parameter`
      , (done) => {
      request(app)
        .put('/api/v1/roles/a')
        .send({
          roleType: 'Doer'
        })
        .set('Authorization', superAdminToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(412);
            expect(res.body.errorMessage).to
            .equal('invalid input syntax for integer: \"a\"');
          }
          done();
        });
    });
    it(`should return  error message with status code 403 , when a user
      makes a request to update a role`, (done) => {
      request(app)
        .put('/api/v1/roles/2')
        .send({
          roleType: 'lame'
        })
        .set('Authorization', userToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(403);
            expect(res.body.errorMessage)
            .to.equal('You do not have access to set role');
          }
          done();
        });
    });

    it(`should return  error message with status code 404 , when a super admin
       makes a request to update a role that does not exist`, (done) => {
      request(app)
        .put('/api/v1/roles/100')
        .send({
          roleType: 'lame'
        })
        .set('Authorization', superAdminToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(404);
            expect(res.body.errorMessage)
            .to.equal('role id not found');
          }
          done();
        });
    });
  });

  describe('Delete role function', () => {
    it(`should return a success message when a user makes a request
      to delete a role `, (done) => {
      request(app)
      .delete('/api/v1/roles/4')
      .set({ Authorization: superAdminToken })
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.body.message).to.be.equal('Role Deleted successfully');
        done();
      });
    });
    it('should return error message when a user makes a request to delete a role'
    , (done) => {
      request(app)
      .delete('/api/v1/roles/4')
      .set({ Authorization: userToken })
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(403);
        expect(res.body.errorMessage).to.be
        .equal('You are not authorized to delete role');
        done();
      });
    });
    it(`should error message with status code 412 , when a super admin makes
      request to delete a role with invalid role id paramater`
    , (done) => {
      request(app)
      .delete('/api/v1/roles/---')
      .set({ Authorization: superAdminToken })
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(412);
        expect(res.body.errorMessage).to.be
        .equal('invalid input syntax for integer: "---"');
        done();
      });
    });
    it(`should return error message with status code 404, when a super admin
       makes a request to delete a role that does not exist  `
      , (done) => {
      request(app)
      .delete('/api/v1/roles/199')
      .set({ Authorization: superAdminToken })
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(404);
        expect(res.body.errorMessage).to.be.equal('role not found');
        done();
      });
    });
  });
});
