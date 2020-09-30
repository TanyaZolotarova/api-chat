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
            include: ["chat_room"]
    });

    return (allChatRooms ? allChatRooms.map( (ChatRoom) => ChatRoom.chat_room) : null);
}

// const getMuttedUserInChat = async (data) => {
//     const chatRoomMutedMembers = await UserChatRoom.findOne( {
//         where: {
//             userId: data.id,
//             chat_room_id: data.chatID,
//             muted: 1,
//     }
//     })
//
//     console.log("chatRoomMutedMembers", chatRoomMutedMembers);
//
//     return (chatRoomMutedMembers ? chatRoomMutedMembers.map((chatRoomMutedMember) => chatRoomMutedMember.chat_room) : null);
// }

module.exports = {
    getChatMembersIDs,
    getUserChats,
    getAllChats,
    // getMuttedUserInChat,
    getUserChatRoom,
};