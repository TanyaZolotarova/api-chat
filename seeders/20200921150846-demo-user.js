'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.bulkInsert('users', [
            {
                name: 'Jon',
                email: 'John@lorem.com',
                password: 'password',
                role: 'user',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                   name: 'admin',
                email: 'admin@admin.com',
                password: 'admin',
                role: 'admin',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                   name: 'Jon Snow',
                email: 'lorem@ipsum.com ',
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
