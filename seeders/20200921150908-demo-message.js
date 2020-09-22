'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('messages', [
            {
                message: 'Test message',
                user_id: 1,
                chatroom_id: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                message: 'Test message 2',
                user_id: 2,
                chatroom_id: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});

  },

  down: async (queryInterface, Sequelize) => {

      await queryInterface.bulkDelete('messages', null, {});
  }
};
