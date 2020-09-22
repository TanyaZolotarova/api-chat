'use strict';

const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class chat_room extends Model {
        static associate(models) {
            // define association here
        }
    };
    chat_room.init({
        is_group_chat: DataTypes.BOOLEAN,
        chat_name: DataTypes.STRING,
        creator_id: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'chat_room',
    });
    return chat_room;
};