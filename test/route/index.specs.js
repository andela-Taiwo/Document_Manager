import supertest from 'supertest';
import chai from 'chai';
import app from '../../server/app';

global.app = app;
const request = supertest(app);
const expect = chai.expect;

describe('Routes: Index', () => {
  describe('GET /api/v1', () => {
    it('returns the API status', (done) => {
      request.get('/')
      .expect(200)
      .end((err, res) => {
        console.log(res);
        // const expected = { message: 'Welcome to the Document Manager API' };
        // expect(res.body.message).to.equal(expected);
        done(err);
      });
    });
  });
});
