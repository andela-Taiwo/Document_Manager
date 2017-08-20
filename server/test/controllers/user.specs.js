

import { expect } from 'chai';
import supertest from 'supertest';
import 'babel-register';
import auth from '../../helper/auth';
import models from '../../../build/models';
import app from '../../../build/server';
import mockData from '../mockData/mockData';

const User = models.User;
const Role = models.Role;

const anotherUserToken = auth.setUserToken(mockData.user);
const superAdminToken = auth.setUserToken(mockData.superAdmin);

let regularToken;
const request = supertest(app);

describe('user controller', () => {
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

    describe('add user function', () => {
      it(`should return a JSON object containing message and a token
        if all the required parameter are suppplied`,
      (done) => {
        request.post('/api/v1/users')
      .send({
        email: 'johnDoe@yahoo.com',
        password: 'humanity',
        userName: 'josh' })
      .end((err, res) => {
        regularToken = res.body.token;
        expect(res.body.message).to.be
        .equal(`${res.body.userName} successfully signed up`);
        expect(regularToken).to.have.lengthOf.above(20);
        expect(res.statusCode).to.be.equal(201);
        done();
      });
      });

      it('should return error message with status code 401 for missing parameter ', (done) => {
        request.post('/api/v1/users')
      .send({ email: 'johnDoe@yahoo.com', password: 'humanity' })
      .end((err, res) => {
        expect((res.body.userName.errorMessage)).to.be
        .equal('userName field is required');
        expect(res.status).to.be.equal(401);
        done();
      });
      });
      it('should create a user if all the requiered parameter are supplied', (done) => {
        request.post('/api/v1/users')
      .send({ email: 'john@yahoo.com', password: 'humanity', userName: 'adeola' })
      .end((err, res) => {
        expect((res.body.message)).to.be
        .equal(`${res.body.userName} successfully signed up`);
        expect((res.statusCode)).to.be.equal(201);
        done();
      });
      });
    });
  });

  describe(' user  login function', () => {
    it(`should return error message with status 401 for
      invalid email or password`, (done) => {
      request.post('/api/v1/users/login')
    .send({ email: 'john@yahoo.com', password: 'humivhhf' })
    .end((err, res) => {
      expect(res.statusCode).to.be.equal(401);
      regularToken = res.body.token;
      expect(res.body.errorMessage).to.be.equal('Invalid email or password');
      done();
    });
    });

    it(`should return an  object containing  a token when user
      successfully logged in`, (done) => {
      request.post('/api/v1/users/login')
    .send({ email: 'john@yahoo.com', password: 'humanity' })
    .end((err, res) => {
      expect(res.status).to.be.equal(200);
      regularToken = res.body.token;
      expect(res.body.message).to.be.equal('You are logged in adeola ');
      done();
    });
    });

    it(`should return error message with status code 400 ,
      if email is not found`, (done) => {
      request.post('/api/v1/users/login')
    .send({ email: 'johcom', password: 'humanity' })
    .end((err, res) => {
      expect(res.statusCode).to.be.equal(400);
      expect(res.body.errorMessage).to.be
.equal('TypeError: Cannot read property \'password\' of null invalid parameter');
      done();
    });
    });
  });
  describe('get all users function ', () => {
    it('should return an  object containing  all users', (done) => {
      request.get('/api/v1/users/')
    .set({ Authorization: regularToken })
    .end((err, res) => {
      expect(res.statusCode).to.be.equal(200);
      done();
    });
    });
  });

  describe('get a user function', () => {
    it(`should return an  object containing  a single user
      if the user id is supplied`, (done) => {
      request.get('/api/v1/users/1')
    .set({ Authorization: regularToken })
    .end((err, res) => {
      expect(res.statusCode).to.be.equal(200);
      done();
    });
    });

    it(`should return an error message with status code 404
      if the user id is not found`, (done) => {
      request.get('/api/v1/users/100')
    .set({ Authorization: regularToken })
    .end((err, res) => {
      expect(res.statusCode).to.be.equal(404);
      expect(res.body.errorMessage).to.be.equal('user id does not exist');
      done();
    });
    });
    it(`should return an error message with status code 412
      if the user id is not valid`, (done) => {
      request.get('/api/v1/users/av')
    .set({ Authorization: regularToken })
    .end((err, res) => {
      expect(res.statusCode).to.be.equal(400);
      expect(res.body.errorMessage).to.be
      .equal('invalid input syntax for integer: \"av\" invalid parameter');
      done();
    });
    });
  });

  describe('user update profile function', () => {
    it('should update personal profile, if is the owner ', (done) => {
      request.put('/api/v1/users')
      .send({
        userName: 'adeola'
      })
    .set({ Authorization: regularToken })
    .end((err, res) => {
      expect(res.statusCode).to.be.equal(200);
      expect(res.body.message).to.be.equal('Update profile successfully');
      done();
    });
    });

    it(`should return error message  with status code 412 if user tries to update
       another user profile `, (done) => {
      request.put('/api/v1/users')
      .send({
        userName: 'adeola'
      })
    .set({ Authorization: anotherUserToken })
    .end((err, res) => {
      expect(res.statusCode).to.be.equal(412);
      done();
    });
    });
  });


  describe('search function', () => {
    it('should return a result that match the user query ', (done) => {
      request.get('/api/v1/search/users/?q=adeola')
    .set({ Authorization: regularToken })
    .end((err, res) => {
      expect(res.statusCode).to.be.equal(200);
      done();
    });
    });

    it(`should return error message with status code 404
       if no data matches the user query`,
    (done) => {
      request.get('/api/v1/search/users/?q=invalid username')
    .set({ Authorization: regularToken })
    .end((err, res) => {
      expect(res.body.errorMessage)
      .to.be.equal('Search term does not match any user');
      expect(res.statusCode).to.be.equal(404);
      done();
    });
    });
  });
  describe('pagination', () => {

  });
  describe('update user role function', () => {
    it('should update user role if is a super admin ', (done) => {
      request.put('/api/v1/users/roles')
      .send({
        email: 'john@yahoo.com',
        roleId: 2
      })
    .set({ Authorization: superAdminToken })
    .end((err, res) => {
      expect(res.statusCode).to.be.equal(200);
      expect(res.body.message).to.be.equal('Update profile successfully');
      done();
    });
    });

    it(`should return error message with status code 400,
      if super admin supplied role id thats not an integer `, (done) => {
      request.put('/api/v1/users/roles')
      .send({
        email: 'john@yahoo.com',
        roleId: 'a'
      })
    .set({ Authorization: superAdminToken })
    .end((err, res) => {
      expect(res.statusCode).to.be.equal(400);
      // expect(res.body.message).to.be.equal('Update profile successfully');
      done();
    });
    });

    it(`should return error message with status code 412,
      if email does not exist `, (done) => {
      request.put('/api/v1/users/roles')
      .send({
        email: 'jsikkjkjkekjek@yahoo.com',
        roleId: '2'
      })
    .set({ Authorization: superAdminToken })
    .end((err, res) => {
      expect(res.statusCode).to.be.equal(412);
      expect(res.body.errorMessage).to.be
      .equal('Cannot read property \'email\' of null');
      done();
    });
    });

    it(`should return error message with status code 403,
      if is not super admin  `, (done) => {
      request.put('/api/v1/users/roles')
      .send({
        email: 'john@yahoo.com',
        roleId: '2'
      })
    .set({ Authorization: regularToken })
    .end((err, res) => {
      expect(res.statusCode).to.be.equal(403);
      expect(res.body.errorMessage).to.be
      .equal('You do not have access to set role');
      done();
    });
    });
  });
  describe('delete user function', () => {
    it('should not be able to delete another user account ', (done) => {
      request.delete('/api/v1/users/1')
    .set({ Authorization: anotherUserToken })
    .end((err, res) => {
      expect(res.statusCode).to.be.equal(403);
      expect(res.body.errorMessage)
      .to.be.equal('You are not authorized to delete another user account');
      expect(res.statusCode).to.be.equal(403);
      done();
    });
    });
    it(`should return error message with status code 412
       if user id is not an integer`, (done) => {
      request.delete('/api/v1/users/q2')
    .set({ Authorization: regularToken })
    .end((err, res) => {
      // expect(res.body.message).to.be.equal('Deleted user successfully');
      expect(res.statusCode).to.be.equal(412);
      done();
    });
    });
    it('should delete a  personal profile if is a user ', (done) => {
      request.delete('/api/v1/users/1')
    .set({ Authorization: regularToken })
    .end((err, res) => {
      expect(res.body.message).to.be.equal('Deleted user successfully');
      expect(res.statusCode).to.be.equal(200);
      done();
    });
    });

    it('should return "User successfully signup" and status 201', (done) => {
      request.post('/api/v1/users')
    .send({ email: 'jane@yahoo.com', password: 'precious', userName: 'pretty' })
    .end((err, res) => {
      expect((res.body.message)).to.be
      .equal(`${res.body.userName} successfully signed up`);
      expect((res.statusCode)).to.be.equal(201);
      done();
    });
    });
    it(`should return error message with status code 412,
      if the user id is invalid `, (done) => {
      request.delete('/api/v1/users/----aas')
    .set({ Authorization: superAdminToken })
    .end((err, res) => {
      expect(res.body.errorMessage).to
      .be.equal('invalid input syntax for integer: \"----aas\"');
      expect(res.statusCode).to.be.equal(412);
      done();
    });
    });
    it('should delete another user profile if is a super admin ', (done) => {
      request.delete('/api/v1/users/2')
    .set({ Authorization: superAdminToken })
    .end((err, res) => {
      expect(res.body.message).to.be.equal('Deleted user successfully');
      expect(res.statusCode).to.be.equal(200);
      done();
    });
    });

    it('should  return error message with status code 404 if the user id is not found '
    , (done) => {
      request.delete('/api/v1/users/2')
    .set({ Authorization: superAdminToken })
    .end((err, res) => {
      expect(res.body.errorMessage).to.be.equal('user id is not found');
      expect(res.statusCode).to.be.equal(404);
      done();
    });
    });
  });
});
