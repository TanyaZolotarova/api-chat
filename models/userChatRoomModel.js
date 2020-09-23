'use strict';

const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class user_chat_room extends Model {
        static associate(models) {
            // define association here
        }
    };

    user_chat_room.init({
        user_id: DataTypes.INTEGER,
        muted: DataTypes.BOOLEAN,
        bunned: DataTypes.BOOLEAN,
        chatroom_id: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'user_chat_room',
    });
    return user_chat_room;
};