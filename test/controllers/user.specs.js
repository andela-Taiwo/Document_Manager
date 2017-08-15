
import { expect } from 'chai';
import supertest from 'supertest';
import 'babel-register';
import auth from '../../server/helper/auth';
import models from '../../build/models';
import app from '../../build/server';
import mockData from '../../mockData/mockData';

const User = models.User;
const Role = models.Role;

const anotherUserToken = auth.setUserToken(mockData.user);

let regularToken;
const request = supertest(app);

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
    it('should return a JSON object containing message and a token',
    (done) => {
      request.post('/api/v1/users')
    .send({
      email: 'johnDoe@yahoo.com',
      password: 'humanity',
      userName: 'josh' })
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
      expect(res.statusCode).to.be.equal(200);
      regularToken = res.body.token;
      done();
    });
    });

    it('should return an  object containing  all user', (done) => {
      request.get('/api/v1/users/')
    .set({ Authorization: regularToken })
    .end((err, res) => {
      expect(res.statusCode).to.be.equal(200);
      done();
    });
    });

    it('should return an  object containing  a single user', (done) => {
      request.get('/api/v1/users/1')
    .set({ Authorization: regularToken })
    .end((err, res) => {
      expect(res.statusCode).to.be.equal(200);
      done();
    });
    });
    it('should uodate user userName ', (done) => {
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

    describe(' user search', () => {
      it('should return a result that match the user query ', (done) => {
        request.get('/api/v1/search/users/?q=adeola')
      .set({ Authorization: regularToken })
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(200);
        done();
      });
      });

      it('should return error message if no data matches the user query ',
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

    describe('Delete user', () => {
      it('should not be able to delete another user account ', (done) => {
        request.delete('/api/v1/users')
      .set({ Authorization: anotherUserToken })
      .end((err, res) => {
        expect(res.body.errorMessage)
        .to.be.equal('You are not authorize to delete another user data');
        expect(res.statusCode).to.be.equal(403);
        done();
      });
      });
      it('should delete a user profile ', (done) => {
        request.delete('/api/v1/users')
      .set({ Authorization: regularToken })
      .end((err, res) => {
        expect(res.body.errorMessage).to.be.equal('Deleted user successfully');
        expect(res.statusCode).to.be.equal(200);
        done();
      });
      });
    });
  });
});
