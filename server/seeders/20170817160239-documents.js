'use strict';
module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Documents', [
      {
        title: 'Django lady',
        content: 'Dummy data,dummy data',
        access: 'role',
        roleId: 1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Learning Outcomes',
        content: 'Active listening, growth mindset, adaptability',
        access: 'public',
        roleId: 1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Private matter',
        content: 'prvay paapapjdjdjjd',
        access: 'private',
        roleId: 1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Monkey Suit',
        content: 'Dressing Sensibilty',
        access: 'private',
        roleId: 2,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        title: 'Healthy Living',
        content: 'Yoga, eat well, dring a lot of water',
        access: 'public',
        roleId: 2,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Dancing Lessons',
        content: 'Yoga, Salsa',
        access: 'role',
        roleId: 2,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'The Drummer boy',
        content: 'King drummer, nonsene',
        access: 'private',
        roleId: 3,
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Awesome Individual',
        content: 'Awesomeness in the amking',
        access: 'role',
        roleId: 3,
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Cooking mastery',
        content: 'Boiling water 101',
        access: 'public',
        roleId: 3,
        userId: 3,
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
