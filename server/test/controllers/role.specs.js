import request from 'supertest';
import { expect } from 'chai';
import mockData from '../mockData/mockData';
import auth from '../../helper/auth';
import app from '../../../build/server';

const dotenv = require('dotenv');

dotenv.config();

const superAdminToken = auth.setUserToken(mockData.superAdmin);
const adminToken = auth.setUserToken(mockData.admin);
const userToken = auth.setUserToken(mockData.regularUser);
const noToken = auth.setUserToken(mockData.noToken);

describe('Role Endpoints', () => {
  describe('create role function', () => {
    it('should  not create a role if is  not a super Admin ', (done) => {
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
    it('should successfully create a new role is a super admin', (done) => {
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
    it(`should return error message with status code 400, if
      roleType parameter is missing`, (done) => {
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

    it('should reject the request when not signed in', (done) => {
      request(app)
        .post('/api/v1/roles/')
        .send({
          roleType: 'Unauthorize'
        })
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(412);
          }
          done();
        });
    });
  });
  describe('get roles function', () => {
    it(`should return error message with status code 403 if user is
      not signed in`, (done) => {
      request(app)
        .get('/api/v1/roles/')
        .set('Authorization', noToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(403);
            expect(res.body.message)
            .to.equal('You are not authorized to view roles');
          }
          done();
        });
    });

    it('should successfully get all roles if is a super admin', (done) => {
      request(app)
        .get('/api/v1/roles/')
        .set('Authorization', superAdminToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(200);
          }
          done();
        });
    });
    it('should successfully get all roles if is an admin', (done) => {
      request(app)
        .get('/api/v1/roles/')
        .set('Authorization', adminToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(200);
          }
          done();
        });
    });
  });

  describe('update role function', () => {
    it(`should return message successfully update role if
       is a super admin`, (done) => {
      request(app)
        .put('/api/v1/roles/3')
        .send({
          roleType: 'Facilitator',

        })
        .set('Authorization', superAdminToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Update role successfully');
          }
          done();
        });
    });

    it(`should return errror message with status code 412,
      if the role id supplied is not valid `, (done) => {
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
    it(`should return  error message with status code 403 ,
      if a regular user try to update role`, (done) => {
      request(app)
        .put('/api/v1/roles/2')
        .send({
          roleType: 'lame'
        })
        .set('Authorization', userToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(403);
            expect(res.body.message)
            .to.equal('You do not have access to set role');
          }
          done();
        });
    });

    it(`should return  error message with status code 404 ,
      if role id is not found`, (done) => {
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

  describe('delete role function', () => {
    it('should delete role if is a super admin', (done) => {
      request(app)
      .delete('/api/v1/roles/3')
      .set({ Authorization: superAdminToken })
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.body.message).to.be.equal('Role Deleted successfully');
        done();
      });
    });
    it('should not delete role if is not a super admin', (done) => {
      request(app)
      .delete('/api/v1/roles/3')
      .set({ Authorization: userToken })
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(403);
        expect(res.body.errorMessage).to.be
        .equal('You are not authorized to delete role');
        done();
      });
    });
    it('should error with status code 412 , if an invalid parameter is supplied', (done) => {
      request(app)
      .delete('/api/v1/roles/---')
      .set({ Authorization: superAdminToken })
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(412);
        done();
      });
    });
    it(`should return error with status code 404, if role to be deleted
      is not found `
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
