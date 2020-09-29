'use strict';

const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UserChatRoom extends Model {
        static associate(models) {
            // define association here
        }
    }

    UserChatRoom.init({
        userId: DataTypes.INTEGER,
        muted: DataTypes.BOOLEAN,
        bunned: DataTypes.BOOLEAN,
        chat_room_id: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'user_chat_room',
    });

    UserChatRoom.associate = (models) => {
        UserChatRoom.belongsTo(models.chat_room, {foreignKey: 'chat_room_id', as: 'chat_room'})
    };

    return UserChatRoom;
};