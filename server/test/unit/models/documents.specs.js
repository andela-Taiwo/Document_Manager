import chai from 'chai';
import models from '../../../../server/models';

const expect = chai.expect;

const Document = models.Document;

describe('Documents Model', () => {
  describe('Create Document', () => {
    it('should create new document', (done) => {
      Document.create({
        id: 12,
        title: 'AKin goes to school',
        content: 'Knowledge is power',
        access: 'role',
        roleId: 3,
        createdAt: '2017-08-17',
        updatedAt: '2017-08-17'
      })
        .then((document) => {
          expect(document.roleId).to.equal(3);
          expect(document.content).to.be.equal('Knowledge is power');
          done();
        });
    });
  });

  describe('Delete document', () => {
    it('should delete existing document', (done) => {
      Document.destroy({
        where: {
          id: 10
        }
      })
        .then((deletedDocument) => {
          expect(deletedDocument).to.equal(1);
          done();
        });
    });
  });
});
