'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Chat_room extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Chat_room.init({

        is_group_chat: DataTypes.BOOLEAN,
        chat_name: DataTypes.STRING,
        creator_id: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Chat_room',
    });
    return Chat_room;
};