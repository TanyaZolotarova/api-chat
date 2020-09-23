'use strict';

const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class message extends Model {
        static associate(models) {
            // define association here
        }
    };

    message.init({
        message: DataTypes.TEXT,
        user_id: DataTypes.INTEGER,
        chatroom_id: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'message',
    });
    return message;
};