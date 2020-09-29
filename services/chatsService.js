const UserChatRoom = require('../models').user_chat_room;

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
    const userChatRooms = await UserChatRoom.findAll({
        where: {
            bunned: 0,
            userId: userId
        },
        include: ["chat_room"]
    });

    return (userChatRooms ? userChatRooms.map((userChatRoom) => userChatRoom.chat_room) : null);
};

const getAllChats = async () => {
    const allChatRooms = await UserChatRoom.findAll({
            include: ["chat_room"]
    });

    // console.log("allChatRooms", allChatRooms)
    //
    return (allChatRooms ? allChatRooms.map( (ChatRoom) => ChatRoom.chat_room) : null);
}

module.exports = {
    getChatMembersIDs,
    getUserChats,
    getAllChats
};