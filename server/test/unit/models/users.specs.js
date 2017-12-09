import chai from 'chai';
import models from '../../../../server/models';

const expect = chai.expect;

const User = models.User;

describe('User Model', () => {
  describe('Create user', () => {
    describe('when email and password fields are absent', () => {
      it('should return Validation error message', (done) => {
        User.create({
          id: 9,
          userName: '',
          email: 'deola001@ya.com',
          password: '',
          roleId: 2,
          createdAt: '2017-08-17',
          updatedAt: '2017-08-17'
        })
        .catch((error) => {
          expect(error.errors[0].message).to.be
            .equal('Validation notEmpty on userName failed');

          expect(error.errors[1].message).to.be
            .equal('Validation notEmpty on password failed');

          expect(error.errors[0].type).to.be
            .equal('Validation error');


          done();
        });
      });
    });

    it('should create new user', (done) => {
      User.create({
        id: 10,
        userName: 'Adeola',
        email: 'deola001@ya.com',
        password: 'role1',
        roleId: 2,
        createdAt: '2017-08-17',
        updatedAt: '2017-08-17'
      })
        .then((user) => {
          expect(user.id).to.be.equal(10);
          expect(user.userName).to.be.equal('Adeola');
          expect(user.roleId).to.equal(2);
          done();
        });
    });
  });
});
