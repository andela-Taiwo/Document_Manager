import supertest from 'supertest';
import chai from 'chai';
import app from '../../app';

global.app = app;
const request = supertest(app);
const expect = chai.expect;

describe('Routes: Index', () => {
  describe('GET /api/v1', () => {
    it('returns the API status', (done) => {
      request.get('/api/v1')
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('Welcome to the Reliable-Docs API!');
        expect(res.status).to.equal(200);
        done();
      });
    });
  });
});
