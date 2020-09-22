'use strict';

const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User_chat_room extends Model {
        static associate(models) {
            // define association here
        }
    };

    User_chat_room.init({
        user_id: DataTypes.INTEGER,
        muted: DataTypes.BOOLEAN,
        bunned: DataTypes.BOOLEAN,
        chatroom_id: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'User_chat_room',
    });
    return User_chat_room;
};