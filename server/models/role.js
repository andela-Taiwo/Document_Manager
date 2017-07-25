
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    roleType: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
        Role.belongsTo(models.User, {
          foreignKey: 'roleId',
          onDelete: 'CASCADE',
        });

        Role.belongsTo(models.Document, {
          foreignKey: 'roleId',
          onDelete: 'CASCADE',
        });
      }
    }
  });
  return Role;
};
