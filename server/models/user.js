import bcrypt from 'bcrypt';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userName: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    roleId: DataTypes.INTEGER
  },
    {
      hooks: {
        beforeCreate: (user) => {
          const salt = bcrypt.genSaltSync(10);
          user.password = bcrypt.hashSync(user.password, salt);
        }
      },
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
        },
      },
    });
  return User;
};
