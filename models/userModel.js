'use strict';

const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class user extends Model {
    static associate(models) {
      // define association here
    }
  };

  user.init({
    user_name: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};