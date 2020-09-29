'use strict';

const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class User extends Model {
    static associate(models) {
      // define association here
    }
  }

  User.init({
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    googleId: DataTypes.STRING,
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user'
    },
      isBanned: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'user',
  });

  User.associate = (models) => {
    User.hasMany(models.message, { as: 'messages'})
  };

  return User;
};