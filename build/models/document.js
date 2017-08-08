'use strict';

module.exports = function (sequelize, DataTypes) {
  var Document = sequelize.define('Document', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    access: DataTypes.STRING,
    roleId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function associate(models) {
        Document.belongsTo(models.Role, {
          foreignKey: 'roleId',
          onDelete: 'CASCADE'
        });
        Document.belongsTo(models.User, {
          foreignKey: 'userId',
          onDelete: 'CASCADE'
        });
      }
    }
  });
  return Document;
};