
'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Users', [
      {
        userName: 'Taiwo',
        password: 'epicAndela',
        roleId: 1,
        email: 'ty@ya.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userName: 'Ay',
        password: 'epicAndela1',
        roleId: 2,
        email: 'ay@ya.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userName: 'Django',
        password: 'epicAndela3',
        roleId: 3,
        email: 'dy@ya.com',
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
