'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Messages', [
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
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
      await queryInterface.bulkDelete('Messages', null, {});
  }
};
