'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.bulkInsert('users', [
            {
                email: "dvf123dfv@mail.ru",
                name: 'John Doe',
                password: 'password',
                role: 'user',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                email: "dvfddddddddddfv@mail.ru",
                name: 'admin',
                password: 'admin',
                role: 'admin',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                email: "dvfdddddfv@mail.ru",
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
