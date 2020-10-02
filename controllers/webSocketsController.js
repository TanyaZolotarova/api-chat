const {getChatMessages, addChatMessages, getLastMessage} = require("../services/messagesService");
const {getChatMembersIDs, getUserChats, getAllChats, getUserChatRoom, createChat, createChatRoom} = require("../services/chatsService");
const {getUserByToken, getUser, getAllUsers, updateUserProfile} = require("../services/usersService");

const middleware = async (socket, next) => {
    const user = await getUserByToken(socket.handshake.query.token);

    if (!user) {
        socket.disconnect(true);
        return next();
    }

    if (user.isBanned) {
        socket.disconnect(true);
        return next();
    }

    socket.user = user;

    return next();
};

const onEnter = async (socket, {chatId}) => {
    const messages = await getChatMessages(chatId);
    socket.emit('enter', messages);
};

const onMessage = async function (socket, {message, chatId}) {
    console.log(`MESSAGE RECEIVED FROM ${socket.user.name}`, message, chatId);

    if (chatId > 0 ) { // group chat
        const userChatRoom = await getUserChatRoom(socket.user.id, chatId);

        if(userChatRoom.bunned) {
            console.log("bannedUser", socket.user.name);
            return;
        }

        if (userChatRoom.muted){
            socket.emit('warning', {message: 'You are muted in this chat'});
            console.log("mutedUser", socket.user.name);
            return;
        }
    }

    const {name, id: userId, email} = socket.user;

    // time-check & send only for needed users & send only for needed chat in & add to db
    try {
        const userRecentMessage = await getLastMessage(chatId, userId);
        if (userRecentMessage) {
            socket.emit('warning', {message: 'Too many requests'});
            return;
        }

        const savedMessage = await addChatMessages({message, chatID: chatId, userId: userId});

        const membersIDs = (chatId > 0 ? await getChatMembersIDs(chatId) : [userId, -chatId]);

        if (membersIDs && membersIDs.length) {
            Object.values(socket.server.sockets.sockets).forEach((sck) => {
                if (membersIDs.includes(sck.user.id)) {
                    const sendTo = (chatId > 0 ? chatId : -(membersIDs.filter((id) => id !== sck.user.id)[0]));

                    console.log('EMIT MESSAGE', {sendTo, savedMessage});

                    sck.emit('message', {
                        ...savedMessage,
                        chatId: sendTo,
                    });
                }
            });
        }
    } catch (err) {
        console.log(err);
    }


    // const ids = [1,2,3,4,5]; // get user ids From db
    // socket.server.sockets.forEach((sck)=>{
    //     if (ids.indexOf(sck.user.id) !== -1){
    //         sck.emit('add_message', {name, id, text, chatId});
    //     }
    // });

    // -- or --

    // send for all users (global)
    // socket.server.sockets.emit('add_message', {name, id, text});
};

const onGetChatHistory = async (socket, {chatId}) => {
    const messages = await getChatMessages(chatId, socket.user.id);
    socket.emit('chatHistory', messages);
};

const onGetUsersList = async (socket, {}) => {
    const users = await getAllUsers();
    socket.emit('usersList', users);
}

const onDisconnect = (socket, data) => {
    // Removing an user from array of 'connections';
    console.log("Disconnected  " + new Date().toTimeString());
    // socket.server.sockets.emit('userOffline', {id});
};

const onUpdateUserProfile = async (socket, data) => {
    const {name, email, password} = data;


    try {
        const profileUpdated = await updateUserProfile(
            socket.user.id,
            !socket.user.googleId ? {name, email, password} : { name }
            );

        // TODO check
        socket.broadcast.emit('updateUser', {
            id:socket.user.id,
            name: profileUpdated.dataValues.name,
        });

        socket.emit('updateUser', {
            id: socket.user.id,
            name: profileUpdated.dataValues.name,
            email: profileUpdated.dataValues.email,
            googleId: profileUpdated.dataValues.googleId
        });
    } catch (err) {
        socket.emit('updateUser', {status: false});
    }
}

const onConnect = (socket) => {
    console.log("Connected successfully  " + new Date().toTimeString());

    // TODO: SEND ALL MESSAGES TO ALL CHATS

    getUser(socket.user.id).then(({id, name, email, googleId}) => {
        socket.emit('connected', {id, name, email, googleId});
    })


    if (socket.user.role === 'user') {
        getUserChats(socket.user.id).then((chatsList) => {
            socket.emit('chatsList', chatsList);
        })
    }

    if (socket.user.role === 'admin') {
        getAllChats().then((chatsList) => { //todo get users like in getUserChats()
                socket.emit('chatsList', chatsList);
            }
        )

        socket.on('sendGlobalMessage', function ({message}) {
            //         // console.log('====[ send_message ]==========>', name +':', id,  text);
            //         // Inside of the function we sending an event 'add_message',
            //         // which will show up a new message for all connected clients;
            const name = socket.user.name;
            const id = socket.user.id;

            socket.server.sockets.emit('add_message', {name, id, message, chatId: 1});
        });

        socket.on('ban', function ({id}) {
            socket.server.sockets.forEach((sck)=>{
                if (sck.user.id === id){
                    // save to db before disconnect;

                    sck.disconnect();
                }
            });
        })


        socket.on('mute', function ({id}) {
            socket.server.sockets.forEach((sck)=>{
                if (sck.user.id === id){
                    // save to db muted status;
                    // updateUser(id, {muted: true});
                    //  sck.user = getUser(id);

                }
            });
        });
    }

    // if (user.role === 'user') {
    //     socket.emit('userChatLists', []);
    // }

    // == CUSTOM EVENT ==  Function, receiving a message from any client;

    //for chat story
    socket.on('enter', (data) => onEnter(socket, data));

    socket.on('message', (data) => onMessage(socket, data));

    // == SYSTEM EVENT ==  Function, which runs when client disconnected from server;
    socket.on('disconnect', (data) => onDisconnect(socket, data));

    socket.on('getChatHistory', (data) => onGetChatHistory(socket, data));

    socket.on('getUsersList', (data) => onGetUsersList(socket, data));

    socket.on('updateUserProfile', (data) => onUpdateUserProfile(socket, data));

    socket.on('create-chat', function ({name, users}) {
        createChat(name, socket.user.id, users.length > 1).then((chatRoom) => {
            console.log(chatRoom)
            createChatRoom(chatRoom.dataValues.id, [socket.user.id, ...users]).then(() => {
                getUserChats(socket.user.id).then((chatsList) => {
                    socket.emit('chatsList', chatsList);
                })
            })
        })
    });

    socket.on('online-users', function () {
        getAllUsers().then((users => socket.emit('online-users', users)));

    })
};

module.exports = {
    middleware,
    onConnect,
};
