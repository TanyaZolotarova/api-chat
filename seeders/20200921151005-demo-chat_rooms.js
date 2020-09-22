'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('chat_rooms', [
            {
                is_group_chat: true,
                chat_name: 'cats',
                creator_id: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                is_group_chat: false,
                chat_name: 'user_name',
                creator_id: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('chat_rooms', null, {});
  }
};
