'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.bulkInsert('users', [
            {
                name: 'John Doe',
                password: 'password',
                role: 'user',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'admin',
                password: 'admin',
                role: 'admin',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'John Doe 2 ',
                password: 'password',
                role: 'user',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    down: async (queryInterface, Sequelize) => {

          await queryInterface.bulkDelete('users', null, {});
    }
};
