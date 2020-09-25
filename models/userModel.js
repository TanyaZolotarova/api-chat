'use strict';

const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class user extends Model {
    static associate(models) {
      // define association here
    }
  }

  user.init({
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    googleId: DataTypes.STRING,
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user'
    },
  }, {
    sequelize,
    modelName: 'user',
  });

  user.associate = function(models) {
    user.hasMany(models.message, { as: 'messages'})
  };

  return user;
};