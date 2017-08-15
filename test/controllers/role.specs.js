import request from 'supertest';
import { expect } from 'chai';
import mockData from '../../mockData/mockData';
import auth from '../../server/helper/auth';
import models from '../../build/models';
import app from '../../build/server';


const dotenv = require('dotenv');

dotenv.config();

const User = models.User;
const Role = models.Role;

const adminToken = auth.setUserToken(mockData.admin);
const regularToken = auth.setUserToken(mockData.regularUser);
const noToken = auth.setUserToken(mockData.noToken);

describe('Role Endpoints', () => {
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
                  { roleType: 'super Admin' },
                  { roleType: 'admin' },
                  { roleType: 'user' },
                ]).then(() => {
                  done();
                });
              }
            });
        }
      });
  });
  describe('Create Roles Endpoint', () => {
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
    beforeEach((done) => {
      User.create(
        mockData.regularUserData
      ).then(() => {
        done();
      });
    });
    it('should successfully create a new role', (done) => {
      request(app)
        .post('/api/v1/roles/')
        .set('Authorization', adminToken)
        .send({
          roleType: 'Editor'
        })
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(201);
            // expect(res.body.message).to.equal('Role successfully created');
          }
          done();
        });
    });
  });

  describe('Get Roles Endpoint', () => {
    it('should reject the request when not signed in', (done) => {
      request(app)
        .get('/api/v1/roles/')
        .set('Authorization', noToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(403);
            expect(res.body.message).to.equal('You are not authorized to view roles');
          }
          done();
        });
    });
    beforeEach((done) => {
      User.create(
        mockData.regularUserData
      ).then(() => {
        done();
      });
    });
    it('should successfully get all roles', (done) => {
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

    it(`should return message successfully update role if
      user is an admin`, (done) => {
      request(app)
        .put('/api/v1/roles')
        .send({
          email: 'john@yahoo.com',
          roleId: 1
        })
        .set('Authorization', adminToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Update profile successfully');
          }
          done();
        });
    });

    it('should reject invalid role ID ', (done) => {
      request(app)
        .put('/api/v1/roles')
        .send({
          email: 'john@yahoo.com',
          roleId: 'invalid id'
        })
        .set('Authorization', adminToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(412);
            expect(res.body.msg).to.equal('invalid role ID');
          }
          done();
        });
    });
    it(`should return  error message if a regular user
      try to change role`, (done) => {
      request(app)
        .put('/api/v1/roles')
        .send({
          email: 'johnDoe@yahoo.com',
          roleType: 1
        })
        .set('Authorization', regularToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(403);
            expect(res.body.message)
            .to.equal('You do not have access set role');
          }
          done();
        });
    });
  });
});
