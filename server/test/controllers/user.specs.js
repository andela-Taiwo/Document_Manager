import { expect } from 'chai';
import supertest from 'supertest';
import 'babel-register';
import auth from '../../helper/auth';
import app from '../../../build/server';
import mockData from '../mockData/mockData';


const anotherUserToken = auth.setUserToken(mockData.anotherUser);
const superAdminToken = auth.setUserToken(mockData.superAdmin);

let userToken;
const request = supertest(app);

describe('User controller', () => {
  describe('Add user function', () => {
    it('should return a success message when a user makes a request to sign up',
    (done) => {
      request.post('/api/v1/users')
    .send({
      email: 'johnDoe@yahoo.com',
      password: 'humanity',
      userName: 'josh' })
    .end((err, res) => {
      userToken = res.body.token;
      expect(res.body).to.be.an('object').to.include
      .any.keys('message', 'userName', 'token');
      expect(res.body.message).to.be
      .equal(`${res.body.userName} successfully signed up`);
      expect(userToken).to.have.lengthOf.above(20);
      expect(res.statusCode).to.be.equal(201);
      done();
    });
    });

    it(`should return error message with status code 401 when a user makes a
      request to sign up with empty userName `, (done) => {
      request.post('/api/v1/users')
    .send({ email: 'johnDoe@yahoo.com', password: 'humanity' })
    .end((err, res) => {
      expect(res.body.userName).to.be.an('object').to.include
      .any.keys('errorMessage');
      expect((res.body.userName.errorMessage)).to.be
      .equal('userName field is required');
      expect(res.status).to.be.equal(401);
      done();
    });
    });
    it('should return a success message when a user makes a request to signup',
     (done) => {
       request.post('/api/v1/users')
    .send({ email: 'john@yahoo.com', password: 'humanity', userName: 'adeola' })
    .end((err, res) => {
      expect(res.body).to.be.an('object').to.include
      .any.keys('message', 'userName', 'token');
      expect((res.body.message)).to.be
      .equal(`${res.body.userName} successfully signed up`);
      expect((res.statusCode)).to.be.equal(201);
      done();
    });
     });
  });


  describe('Login function', () => {
    it(`should return error message with status 401 when a user makes a
       request to login with wrong password`, (done) => {
      request.post('/api/v1/users/login')
    .send({ email: 'john@yahoo.com', password: 'humivhhf' })
    .end((err, res) => {
      expect(res.statusCode).to.be.equal(401);
      expect(res.body).to.be.an('object').to.include
      .any.keys('errorMessage');
      expect(res.body.errorMessage).to.be.equal('Invalid email or password');
      done();
    });
    });

    it(`should return a success message and token when a user
      logs in successfully`,
     (done) => {
       request.post('/api/v1/users/login')
    .send({ email: 'john@yahoo.com', password: 'humanity' })
    .end((err, res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body).to.be.an('object').to.include
      .any.keys('message', 'token');
      userToken = res.body.token;
      expect(userToken).to.have.lengthOf.above(20);
      expect(res.body.message).to.be.equal('You are logged in adeola ');
      done();
    });
     });

    it(`should return error message with status code 400 when a user makes a
      request to sign in without being registered ,`, (done) => {
      request.post('/api/v1/users/login')
    .send({ email: 'johcom', password: 'humanity' })
    .end((err, res) => {
      expect(res.statusCode).to.be.equal(400);
      expect(res.body).to.be.an('object').to.include
      .any.keys('errorMessage');
      expect(res.body.errorMessage).to.be.equal('You have not registered');
      done();
    });
    });
  });

  describe('Get all users function ', () => {
    it('should return all users with success message when a user makes a request'
    , (done) => {
      request.get('/api/v1/users/')
    .set({ Authorization: userToken })
    .end((err, res) => {
      expect(res.statusCode).to.be.equal(200);
      expect(res.body).to.be.an('object').to.include
      .any.keys('message', 'users');
      expect(res.body.message).to.be.equal('Users successfully retrieved');
      expect(res.body.users.length).to.be.equal(5);
      expect(res.body.pagination.totalCount).to.be.equal(5);
      done();
    });
    });
  });

  describe('Get a user function', () => {
    it(`should return a success message when a user makes a request to
      get a single user`, (done) => {
      request.get('/api/v1/users/1')
    .set({ Authorization: userToken })
    .end((err, res) => {
      expect(res.statusCode).to.be.equal(200);
      expect(res.body).to.be.an('object').to.include
      .any.keys('message', 'user');
      expect(res.body.message).to.be.equal('User successfully retrieved');
      expect(res.body.user.id).to.be.equal(1);
      done();
    });
    });

    it(`should return an error message with status code 404
      when a user makes a request with id parameter that does not exist`, (done) => {
      request.get('/api/v1/users/100')
    .set({ Authorization: userToken })
    .end((err, res) => {
      expect(res.body).to.be.an('object').to.include
      .any.keys('errorMessage');
      expect(res.statusCode).to.be.equal(404);
      expect(res.body.errorMessage).to.be.equal('user id does not exist');
      done();
    });
    });
    it(`should return an error message with status code 400 when a user makes a
       request with a string as an id parameter`, (done) => {
      request.get('/api/v1/users/av')
    .set({ Authorization: userToken })
    .end((err, res) => {
      expect(res.statusCode).to.be.equal(400);
      expect(res.body).to.be.an('object').to.include
      .any.keys('errorMessage');
      expect(res.body.errorMessage).to.be
      .equal('invalid input syntax for integer: \"av\" invalid parameter');

      done();
    });
    });
  });

  describe('Update User Account function', () => {
    it(`should return success message when a user makes a request to update
     a personal account`, (done) => {
      request.put('/api/v1/users')
      .send({
        userName: 'adeola'
      })
    .set({ Authorization: userToken })
    .end((err, res) => {
      expect(res.statusCode).to.be.equal(200);
      expect(res.body).to.be.an('object').to.include
      .any.keys('message', 'user');
      expect(res.body.message).to.be.equal('adeola Account updated successfully');
      done();
    });
    });

    it(`should return error message  with status code 412 when a user makes
      a request to update another user account `, (done) => {
      request.put('/api/v1/users')
      .send({
        userName: 'adeola'
      })
    .set({ Authorization: anotherUserToken })
    .end((err, res) => {
      expect(res.statusCode).to.be.equal(412);
      expect(res.body).to.be.an('object').to.include
      .any.keys('errorMessage');
      expect(res.body.errorMessage)
      .to.be.equal('Cannot read property \'update\' of null');
      done();
    });
    });
  });


  describe('Search function', () => {
    it(`should return all user(s) that match the search query when a
      user makes request `, (done) => {
      request.get('/api/v1/search/users/?q=adeola')
    .set({ Authorization: userToken })
    .end((err, res) => {
      expect(res.statusCode).to.be.equal(200);
      expect(res.body).to.be.an('object').to.include
      .any.keys('message', 'users', 'pagination');
      expect(res.body.pagination.totalCount).to.be.equal(1);
      expect(res.body.message).to.be.equal('successfully retrieved user(s)');
      done();
    });
    });

    it(`should return error message with status code 404
       when user makes a request with username parameter that does not exist`,
    (done) => {
      request.get('/api/v1/search/users/?q=invalid username')
    .set({ Authorization: userToken })
    .end((err, res) => {
      expect(res.body).to.be.an('object').to.include
      .any.keys('errorMessage');
      expect(res.body.errorMessage)
      .to.be.equal('Search term does not match any user');
      expect(res.statusCode).to.be.equal(404);
      done();
    });
    });
  });

  describe('Update user role function', () => {
    it(`should return success message when a super admin makes a request
       to update user role`, (done) => {
      request.put('/api/v1/users/roles')
      .send({
        email: 'john@yahoo.com',
        roleId: 2
      })
    .set({ Authorization: superAdminToken })
    .end((err, res) => {
      expect(res.body).to.be.an('object').to.include
      .any.keys('message', 'user');
      expect(res.statusCode).to.be.equal(200);
      expect(res.body.message).to.be.equal('User role updated successfully');
      done();
    });
    });

    it(`should return error message with status code 400, when a super admin
       makes a request to update user role with invalid id `, (done) => {
      request.put('/api/v1/users/roles')
      .send({
        email: 'john@yahoo.com',
        roleId: 'a'
      })
    .set({ Authorization: superAdminToken })
    .end((err, res) => {
      expect(res.body).to.be.an('object').to.include
      .any.keys('errorMessage');
      expect(res.statusCode).to.be.equal(400);
      expect(res.body.errorMessage).to.be.equal('invalid role ID');
      done();
    });
    });

    it(`should return error message with status code 412, when a super admin
      makes a request to update the role of a user that does not exist `
      , (done) => {
      request.put('/api/v1/users/roles')
      .send({
        email: 'jsikkjkjkekjek@yahoo.com',
        roleId: '2'
      })
    .set({ Authorization: superAdminToken })
    .end((err, res) => {
      expect(res.body).to.be.an('object').to.include
      .any.keys('errorMessage');
      expect(res.statusCode).to.be.equal(412);
      expect(res.body.errorMessage).to.be
      .equal('Cannot read property \'email\' of null');
      done();
    });
    });

    it(`should return error message with status code 403, when a user makes a
       request to update user role `, (done) => {
      request.put('/api/v1/users/roles')
      .send({
        email: 'john@yahoo.com',
        roleId: '2'
      })
    .set({ Authorization: userToken })
    .end((err, res) => {
      expect(res.statusCode).to.be.equal(403);
      expect(res.body).to.be.an('object').to.include
      .any.keys('errorMessage');
      expect(res.body.errorMessage).to.be
      .equal('You do not have access to set role');
      done();
    });
    });
  });
  describe('Delete user function', () => {
    it(`should return an error message with status code 403 when a user makes
     a request to delete another user account`, (done) => {
      request.delete('/api/v1/users/1')
    .set({ Authorization: anotherUserToken })
    .end((err, res) => {
      expect(res.body).to.be.an('object').to.include
      .any.keys('errorMessage');
      expect(res.body.errorMessage)
      .to.be.equal('You are not authorized to delete another user account');
      expect(res.statusCode).to.be.equal(403);

      done();
    });
    });
    it(`should return error message with status code 412
       when user makes a request to delete with an invalid user id`, (done) => {
      request.delete('/api/v1/users/q2')
    .set({ Authorization: userToken })
    .end((err, res) => {
      expect(res.body).to.be.an('object').to.include
      .any.keys('errorMessage');
      expect(res.statusCode).to.be.equal(412);
      expect(res.body.errorMessage).to.be
      .equal('invalid input syntax for integer: "q2"');
      done();
    });
    });
    it(`should return a success message when  user makes a request to
       delete personal account`, (done) => {
      request.delete('/api/v1/users/5')
    .set({ Authorization: userToken })
    .end((err, res) => {
      expect(res.body).to.be.an('object').to.include
      .any.keys('message');
      expect(res.body.message).to.be.equal('User deleted successfully');
      expect(res.statusCode).to.be.equal(200);
      done();
    });
    });

    it(`should return error message with status code 412, when a super admin
      makes a request to delete an account with invalid user id `, (done) => {
      request.delete('/api/v1/users/----aas')
    .set({ Authorization: superAdminToken })
    .end((err, res) => {
      expect(res.body).to.be.an('object').to.include
      .any.keys('errorMessage');
      expect(res.body.errorMessage).to
      .be.equal('invalid input syntax for integer: \"----aas\"');
      expect(res.statusCode).to.be.equal(412);
      done();
    });
    });
    it(`should return a success message when a super admin makes a
      request to delete an acccount`, (done) => {
      request.delete('/api/v1/users/2')
    .set({ Authorization: superAdminToken })
    .end((err, res) => {
      expect(res.body).to.be.an('object').to.include
      .any.keys('message');
      expect(res.body.message).to.be.equal('User deleted successfully');
      expect(res.statusCode).to.be.equal(200);
      done();
    });
    });

    it(`should  return error message with status code 404 when a super admin
      makes a request to delete an account that does not exist`
    , (done) => {
      request.delete('/api/v1/users/2')
    .set({ Authorization: superAdminToken })
    .end((err, res) => {
      expect(res.body).to.be.an('object').to.include
      .any.keys('errorMessage');
      expect(res.body.errorMessage).to.be.equal('user id is not found');
      expect(res.statusCode).to.be.equal(404);
      done();
    });
    });
  });
});
