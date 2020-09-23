'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.bulkInsert('user_chat_rooms', [
            {
                userId: 1,
                muted: false,
                bunned: false,
                chatroom_id: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: 2,
                muted: true,
                bunned: true,
                chatroom_id: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    down: async (queryInterface, Sequelize) => {

        await queryInterface.bulkDelete('user_chat_rooms', null, {});
    }
};
