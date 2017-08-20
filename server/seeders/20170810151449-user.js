
module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Users', [
      {
        userName: 'Django lady',
        password: process.env.SUPERADMIN_PASSWORD,
        email: process.env.SUPERADMIN_EMAIL,
        roleId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userName: 'kennysoft',
        password: process.env.ADMIN_PASSWORD,
        email: process.env.ADMIN_EMAIL,
        roleId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userName: 'YSlim',
        password: process.env.USER_PASSWORD,
        email: process.env.USER_EMAIL,
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
