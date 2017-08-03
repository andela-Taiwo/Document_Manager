'use strict';

module.exports = function (sequelize, DataTypes) {
  var Role = sequelize.define('Role', {
    roleType: DataTypes.STRING
  }, {
    classMethods: {
      associate: function associate(models) {
        // associations can be defined here
        Role.hasMany(models.User, {
          foreignKey: 'roleId',
          onDelete: 'CASCADE'
        });

        Role.belongsTo(models.Document, {
          foreignKey: 'roleId',
          onDelete: 'CASCADE'
        });
      }
    }
  });
  return Role;
};