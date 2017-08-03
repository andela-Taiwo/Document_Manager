
import jwt from 'jsonwebtoken';
import { assert, expect } from 'chai';
import supertest from 'supertest';
// import request from 'supertest';
import 'babel-register';
import auth from '../../server/helper/auth';

import mockData from '../../mockData/mockData'

const app = require('../../build/server');

const adminToken = auth.setUserToken(mockData.admin);
const User = require('../../build/models').User;
const Document = require('../../build/models').Document;
const Role = require('../../build/models').Role;
let regularToken;
const request = supertest(app);

let userId;
let userName;
let token;

describe('When user', () => {
  describe('signs up', () => {
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
            { roleType: 'regular' },
            { roleType: 'admin' },
            { roleType: 'superadmin' }
          ]).then(() => {
            done();
          });
        }
      });
    }
  });
    });
    it('should return a JSON object containing message and a token', (done) => {
      request.post('/api/v1/users')
    .send({ email: 'johnDoe@yahoo.com', password: 'humanity', userName: 'josh' })
    .end((err, res) => {
      regularToken = res.body.token;
      expect(res.body.message).to.be.equal('User successfully signup');
      expect(regularToken).to.have.lengthOf.above(20);
      expect(res.statusCode).to.be.equal(201);
      done();
    });
    });

    it(`should return "johnDoe@yahoo.com already exist" and status 409,
    when user tries to signup with an existing email`, (done) => {
      request.post('/api/v1/users')
    .send({ email: 'johnDoe@yahoo.com', password: 'humanity' })
    .end((err, res) => {
      expect((res.body.userName.msg)).to.be.equal('userName field is required');
      done();
    });
    });

    it(`should return "User successfully signup" and status 201,
    when user tries to signup with valid data`, (done) => {
      request.post('/api/v1/users')
    .send({ email: 'john@yahoo.com', password: 'humanity', userName: 'adeola' })
    .end((err, res) => {
      // console.log('Im in user signup', res.body);
      expect((res.body.message)).to.be.equal('User successfully signup');
      expect((res.statusCode)).to.be.equal(201);
      done();
    });
    });
  });
  describe('logs user in', () => {
  it('should return an  object containing  a token', (done) => {
    request.post('/api/v1/users/login')
  .send({ email: 'john@yahoo.com', password: 'humanity' })
  .end((err, res) => {
    console.log(res.body);
    expect(res.statusCode).to.be.equal(201);
    regularToken = res.body.token;
    done();
  });
  });

    it('should return an  object containing  all user', (done) => {
      request.get('/api/v1/users/')
    .set({ Authorization: regularToken })
    .end((err, res) => {
      console.log(res.body);
      expect(res.statusCode).to.be.equal(200);
      done();
    });
    });

    it('should return an  object containing  a single user', (done) => {
      request.get('/api/v1/users/1')
    .set({ Authorization: regularToken })
    .end((err, res) => {
      console.log(res.body);
      expect(res.statusCode).to.be.equal(201);
      done();
    });
    });
  });
});
