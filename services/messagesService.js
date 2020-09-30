const messageChatRoom = require('../models').message;
const Message = require('../models').message;
const Op = require('../models').Sequelize.Op;

const getChatMessages = async (chatID) => {

    const chatRoomMessages = await messageChatRoom.findAll({
        where: {
            chat_room_id: chatID,
        }
    });

    // console.log(chatRoomMessages)

    return (chatRoomMessages
        ? chatRoomMessages.map((roomMessages) => roomMessages.message)
        : null);
};

const addChatMessages = async (data) => {
    // console.log("DATA ADD CHAT MESSAGES", data);
    const createMessage = await Message.build();

    createMessage.message = data.text;
    createMessage.userId = data.userId;
    createMessage.chat_room_id = data.chat_room_id;

    return await createMessage.save();
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
    getLastMessage
}
