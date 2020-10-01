const Message = require('../models').message;
const Op = require('../models').Sequelize.Op;

const getChatMessages = async (chatID, userId) => {
    console.log('getChatMessages', {chatID, userId});

    const conditions = [];

    if (chatID < 0) { // private chat
        conditions.push({
            [Op.or]: [
                {
                    userId: -chatID,
                    chat_room_id: -userId
                },
                {
                    userId: userId,
                    chat_room_id: chatID
                },
            ]

        });
    } else { // group chat
        conditions.push({chat_room_id: chatID});
    }

    return await Message.findAll({
        where: conditions
    });
};

const addChatMessages = async (data) => {
    // console.log("DATA ADD CHAT MESSAGES", data);
    const createMessage = await Message.build();

    createMessage.message = data.message;
    createMessage.userId = data.userId;
    createMessage.chat_room_id = data.chatID;

    return (await createMessage.save()).get();
}


const getLastMessage = async (chatID, userId) => {
    return Message.findOne({
        where: {
            chat_room_id: chatID,
            userId,
            createdAt: {
                [Op.gt]: new Date(Date.now() - (10 * 1000)),
            }
        }
    });
};

module.exports = {
    getChatMessages,
    addChatMessages,
    getLastMessage,
}
