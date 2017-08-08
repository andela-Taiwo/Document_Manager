'use strict';

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
    userName: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    roleId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function associate(models) {
        // associations can be defined here
        User.hasMany(models.Document, {
          foreignKey: 'userId',
          as: 'documents'
        });
        User.belongsTo(models.Role, {
          foreignKey: 'roleId',
          onDelete: 'CASCADE'
        });
      }
    }
  });
  return User;
};