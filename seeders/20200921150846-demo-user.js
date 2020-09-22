'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.bulkInsert('users', [
            {
                user_name: 'John Doe',
                password: 'password',
                role: false,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                user_name: 'John Doe 2 ',
                password: 'password',
                role: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    down: async (queryInterface, Sequelize) => {

          await queryInterface.bulkDelete('users', null, {});
    }
};
