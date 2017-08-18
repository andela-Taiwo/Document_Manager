import bcrypt from 'bcrypt';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userName: {
      type: DataTypes.STRING,
      validate: { notEmpty: true, min: 6 }
    },
    password: {
      type: DataTypes.STRING,
      validate: { notEmpty: true, min: 6 }
    },
    email: {
      type: DataTypes.STRING,
      validate: { isEmail: true }
    },
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
