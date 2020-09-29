'use strict';

const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Message extends Model {
        static associate(models) {
            // define association here
        }
    }

    Message.init({
        message: DataTypes.TEXT,
        userId: DataTypes.INTEGER,
        chat_room_id: DataTypes.INTEGER,
        // user_id: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     references: {         // User hasMany WorkingDays n:n
        //         model: 'user',
        //         key: 'id'
        //     }
        // },
    }, {
        sequelize,
        modelName: 'message',
    });

    Message.associate = function(models) {
        Message.belongsTo(models.user, {foreignKey: 'userId', as: 'users'})
    };

    return Message;
};