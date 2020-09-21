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
        await queryInterface.bulkInsert('Users', [
            {
                user_name: 'John Doe',
                email: 'test@email',
                password: 'password',
                role: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                user_name: 'John Doe 2 ',
                email: 'test@email2',
                password: 'password',
                role: 2,
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
          await queryInterface.bulkDelete('Users', null, {});
    }
};
