'use strict';

const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class user extends Model {
    static associate(models) {
      // define association here
    }
  };

  user.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user'
    },
    googleId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'user',
  });

  user.associate = function(models) {
    user.hasMany(models.message, { as: 'messages'})
  };

  return user;
};