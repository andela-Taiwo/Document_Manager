'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Users', [
      {
        userName: 'Django lady',
        password: '$2a$10$yIbE1CvcNii2ZUOX/FzfsODdeH20IEr2E0OUWQ0NZOE69gYUM.AZC',
        email: 'taiwo@ya.com',
        roleId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userName: 'kennysoft',
        password: '$2a$10$WQxC.fOLk2QQkKfV2IxogemUeJnwcFOCGhQxFVRP3cQvf8DMv8v9q',
        email: 'kenny@ya.com',
        roleId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userName: 'YSlim',
        password: '$2a$10$Ngs62NM67Qwfl5RHcUtmf.I5D86wPjFMiydFg7QCqWXdUuqVShD9m',
        email: 'yusuf@ya.com',
        roleId: 3,
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
