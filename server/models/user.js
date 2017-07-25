
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    email: DataTypes.STRING,
    roleId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
        User.hasMany(models.Document, {
          foreignKey: 'userId',
          as: 'documents',
        });
        User.belongsTo(models.Role, {
          foreignKey: 'roleId',
          onDelete: 'CASCADE',
        });
      }
    }
  });
  return User;
};
