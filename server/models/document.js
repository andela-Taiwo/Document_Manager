
module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    access: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        Document.belongsTo(models.Role, {
          foreignKey: 'roleId',
          onDelete: 'CASCADE',
        });
        Document.belongsTo(models.User, {
          foreignKey: 'userId',
          onDelete: 'CASCADE',
        });
      }
    }
  });
  return Document;
};
