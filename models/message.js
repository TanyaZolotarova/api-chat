'use strict';

const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Message extends Model {
        static associate(models) {
            // define association here
        }
    };

    Message.init({
        message: DataTypes.TEXT,
        user_id: DataTypes.INTEGER,
        chatroom_id: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Message',
    });
    return Message;
};