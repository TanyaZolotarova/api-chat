const UserChatRoom = require('../models').user_chat_room;
const ChatRoom = require('../models').chat_room;

const createChat = (chatName, userId, isGroup) =>{
    return ChatRoom.create({ chat_name: chatName, creator_id: userId, is_group_chat: isGroup });
    // chat.name = data.chat_name;
    // return chat.save()
};
const User = require('../models').user;
const Op = require('../models').Sequelize.Op;

const getChatMembersIDs = async (chatID) => {

    const chatRoomMembers = await UserChatRoom.findAll({
        where: {
            chat_room_id: chatID,
            bunned: 0
        }
    });

    return (chatRoomMembers ? chatRoomMembers.map((roomMember) => roomMember.userId) : null);
};


const getUserChats = async (userId) => {

    const userChatRooms = (await UserChatRoom.findAll({
        where: {
            bunned: 0,
            userId: userId
        },
        include: ["chat_room"]
    })).map((userChatRoom) => userChatRoom.chat_room);

    const users = (await User.findAll( {
        where: {
            id: {
                [Op.not]: userId
            }
        }
    })).map((user) => {
        return {
            id: -user.id,
            chat_name: user.name,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            creator_id: null, // todo
            is_group_chat: false,
        };
    });

    return [...userChatRooms, ...users];
};

const getUserChatRoom = (userId, chatId) => {
    return UserChatRoom.findOne({
        where: {
            userId: userId,
            chat_room_id: chatId
        }
    });
};

const getAllChats = async () => {
    const allChatRooms = await UserChatRoom.findAll({
            include: ["chat_room"],
            group: ['chat_room_id']
    });

    return (allChatRooms ? allChatRooms.map( (ChatRoom) => ChatRoom.chat_room) : null);
}

const createChatRoom = (chatRoomId, users) => {
    console.log('!!!!!!!!!! ', chatRoomId)
    return Promise.all(users.map(userId => UserChatRoom.create({ chat_room_id: chatRoomId, userId, muted: 0, bunned: 0 })));
}

module.exports = {
    getChatMembersIDs,
    getUserChats,
    getAllChats,
    createChat,
    createChatRoom,
    getUserChatRoom,
};

