const Message = require('../models').message;
const Op = require('../models').Sequelize.Op;

const getChatMessages = async (chatID) => {
    console.log('getChatMessages', {chatID});

    const conditions = [
        {chat_room_id: chatID}
    ];

    if (chatID < 0) { // private chat
        conditions.push({
            userId: -chatID,
            chat_room_id: {
                [Op.lt]: 0
            }
        });
    }

    return await Message.findAll({
        where: {
            [Op.or]: conditions
        }
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
