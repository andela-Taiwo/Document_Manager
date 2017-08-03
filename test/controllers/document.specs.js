
import jwt from 'jsonwebtoken';
import { assert, expect } from 'chai';
import request from 'supertest';
import 'babel-register';
import auth from '../../server/helper/auth';
import userRoute from '../../build/controllers';
import mockData from '../../mockData/mockData'

const User = require('../../build/models').User;
const Document = require('../../build/models').Document;
const Role = require('../../build/models').Role;

const app = require('../../build/app');


const data = {
  userId: 1,
  email: 'johnDoe@yahoo.com',
  roleId: 2
}
const adminToken = auth.setUserToken(mockData.admin);
// console.log(adminToken);
const regularToken = auth.setUserToken(data);
// console.log(regularToken)

describe('When login as user', () => {
  describe('Creat new', () => {
    it('should return a succes message when document is created', (done) => {
      request(app)
    .post('/api/v1/documents')
    .set('Accept', 'application/json')
    .set({ Authorization: regularToken })
    .send({
      title: ' Akin goes to school',
      content: 'The village headmaster',
      access: 'public',
    })
    .end((err, res) => {
      // console.log(res.body);
      expect(res.body.message).to.eql('New Document created successfully');
      expect(res.statusCode).to.be.equal(201);
      done();
    });
    });

    it('should return a failure message when document has  no tiltle', (done) => {
      request(app)
    .post('/api/v1/documents')
    .set('Accept', 'application/json')
    .set({ Authorization: regularToken })
    .send({
      title: ' Akin goes to school',
      access: 'public',
    })
    .end((err, res) => {
      // console.log(res.body.message);
      expect(res.body.message.content.msg).to.eql(mockData.invalidContent.msg);
      expect(res.statusCode).to.be.equal(412);
      done();
    });
    });

    it('should return a message "New Document created successfully" when user create document', (done) => {
      request(app)
    .post('/api/v1/documents')
    .set('Accept', 'application/json')
    .set({ Authorization: regularToken })
    .send({
      title: ' Akin goes to school',
      access: 'public',
      content: 'The village headmaster',
    })
    .end((err, res) => {
      // console.log(res);
      expect(res.body.message).to.eql('New Document created successfully');
      expect(res.statusCode).to.be.equal(201);
      done();
    });
    });

    it('should return a failure message when user has no suplied invalid token', (done) => {
      request(app)
    .post('/api/v1/documents')
    .set('Accept', 'application/json')
    .send({
      title: ' Akin goes to school',
      access: 'public',
      content: 'The village headmaster',
    })
    .end((err, res) => {
      // console.log(res);
      expect(res.text).to.eql('Token not provided');
      expect(res.statusCode).to.be.equal(412);
      done();
    });
    });
  });

  describe('get instances of document', () => {
    it(`should return a status code 200,
      and a JSON object showing number of available documents and
      corresponding document information`, (done) => {
      request(app)
      .get('/api/v1/documents')
      .set('Accept', 'application/json')
      .set({ Authorization: regularToken })
      .end((err, res) => {
        console.log(res);
        // expect(res.body.documentCount).to.equal(5);
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });
  });
});
