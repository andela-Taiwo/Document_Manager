'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Roles', [
      {
        roleType: 'super admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleType: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleType: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down(queryInterface) {
    queryInterface.bulkDelete('Users', null, {});
    queryInterface.bulkDelete('Documents', null, {});
    return queryInterface.bulkDelete('Roles', null, {});
  }
};
