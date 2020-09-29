'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('messages', [
            {
                message: 'Test message',
                userId: 1,
                chat_room_id: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                message: 'Test message 2',
                userId: 2,
                chat_room_id: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});

  },

  down: async (queryInterface, Sequelize) => {

      await queryInterface.bulkDelete('messages', null, {});
  }
};
