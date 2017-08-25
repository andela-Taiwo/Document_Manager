module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { notEmpty: true, min: 6 }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { notEmpty: true, min: 6 }
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        defaultValue: 3,
        references: {
          model: 'Roles',
          key: 'id',
          as: 'roleId',
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('Users');
  }
};
