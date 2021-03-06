'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        unique: true
      },
      googleId: {
        allowNull: true,
        unique: true,
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING
      },

      role: {
        type: Sequelize.STRING,
        default: 'user'
      },
       name: {
        type: Sequelize.STRING,
        unique: true
      },

      isBanned: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};