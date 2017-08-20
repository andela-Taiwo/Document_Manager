
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    roleType: {
      type: DataTypes.STRING,
      validate: { notEmpty: true, min: 4 }
    },

  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
        Role.hasMany(models.User, {
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
