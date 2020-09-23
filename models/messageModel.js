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
        userId: DataTypes.INTEGER,
        chatroom_id: DataTypes.INTEGER,
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

    message.associate = function(models) {
        message.belongsTo(models.user, {foreignKey: 'userId', as: 'users'})
    };
    return message;
};