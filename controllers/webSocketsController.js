
const {getChatMessages, addChatMessages, getLastMessage} = require("../services/messagesService");
const {getChatMembersIDs, getUserChats, getAllChats, getUserChatRoom, createChat, createChatRoom} = require("../services/chatsService");
const {getUserByToken, getUser, getAll} = require("../services/usersService");

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
    const userChatRoom = await getUserChatRoom(socket.user.id, chatId);

    console.log(`MESSAGE RECEIVED FROM ${socket.user.name}`, message, chatId);

    // Inside of the function we sending an event 'add_message',
    // which will show up a new message for all connected clients;

    const {name, id, email } = socket.user;

    // console.log("socket.user", socket.user );

    // const banned =  socket.user.isBanned;
    //
    if(userChatRoom.bunned) {
        console.log("bannedUser", socket.user.name);
        return;
    }

    if (userChatRoom.muted){
        socket.emit('warning', {message: 'You are muted in this chat'});
        console.log("mutedUser", socket.user.name);
        return;
    }

    //fixme

    // const muted = getMuttedUserInChat({chat_room_id: 1, userId: 12}).then(value => {
    //     if(value) {
    //         console.log(value);
    //     }
    // }).catch( (err) => {
    //     console.log(err);
    // })

    // console.log("muted ===========", muted)

    // getChatMessages(chatId).then(() => {
    //     // console.log("chatId", chatId);
    // })

    // time-check & send only for needed users & send only for needed chat in & add to db

    getLastMessage(chatId, id)
        .then(value => {
            if(!value) {
                return addChatMessages({message, chatID: chatId, userId: id })
            }
            socket.emit('warning', {message: 'Too many requests'});
            return Promise.reject(new Error('CANT SEND'))
        })
        .then(() =>
        {
            console.log('SEND TO CHAT MEMBERS');
            return getChatMembersIDs(chatId)
        })
        .then((membersIDs) => {
            if (membersIDs && membersIDs.length) {
                Object.values(socket.server.sockets.sockets).forEach((sck) => {
                    if (membersIDs.includes(sck.user.id)) {
                        console.log('EMITED');
                        sck.emit('message', {message, chatId, name, email });
                    }
                });
            }
        })
        .catch(err => console.log(err))

    // addChatMessages({text, chatId, id}).then(() => {
    //     // console.log("text, chatId, id" ,text, chatId, id)
    // });

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
    const messages = await getChatMessages(chatId);
    socket.emit('chatHistory', messages);
};

const onDisconnect = (socket, data) => {
    // Removing an user from array of 'connections';
    console.log("Disconnected  " +  new Date().toTimeString());
    // socket.server.sockets.emit('userOffline', {id});
};

const onConnect = (socket) => {
    console.log("Connected successfully  " + new Date().toTimeString());

    // TODO: SEND ALL MESSAGES TO ALL CHATS

    getUser(socket.user.id).then(({id, name, email}) => {
        socket.emit('connected', {id, name, email});
    })


    // console.log('User:', socket.user.name);
    // console.log('User.role:', socket.user.role);
    // console.log('User.isBanned:', socket.user.isBanned);

    if (socket.user.role === 'user') {
        getUserChats(socket.user.id).then((chatsList) => {
            socket.emit('chatsList', chatsList);
        })
    }


    // socket.emit('message', {});
    // socket.server.sockets.clients((err, clients) => {
    //     if (err) {
    //         console.error(err);
    //         return;
    //     }
    //
    //     console.log('CLIENTS', clients);
    //     console.log(socket.server.sockets.sockets[clients[0]]);
    // });

    // socket.server.on('connection', async (socket) => {
    //     const {token} = socket.handshake.query;
    //     const user = await user.findOne({ token });
    //     console.log('Connected! User: ' + user && user.name);
    //
    //     try {
    //         jwt.verify(token, 'secret');
    //     } catch (error) {
    //         console.log(error);
    //         socket.disconnect();
    //         return;
    //     }


    // try {
    //
    //     if (!token){
    //         throw new Error();
    //         // socket.disconnect(true);
    //     }
    //
    //     const decodedToken = jwt.decode(token, secret);
    //     const user = getUser(decodedToken.id);
    //
    //     if (!user || user.banned){
    //         // socket.close();
    //         throw new Error();
    //     }
    // }catch (e) {
    //     socket.disconnect();
    // }
    //
    // socket.user = user;

    // send for all
    // socket.server.sockets.emit('newOnLineUser', {name, id, text});

    if (socket.user.role === 'admin') {
        getAllChats().then((chatsList) => {
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

    socket.on('create-chat', function ({name, users}) {
        createChat(name, socket.user.id, users.length > 1).then((chatRoom) => {
            console.log(chatRoom)
            createChatRoom(chatRoom.dataValues.id, [socket.user.id, ...users]).then(() => {
                getAllChats().then((chatsList) => {
                    socket.emit('chatsList', chatsList);
                })
            })
        })
    });

    socket.on('online-users', function () {
        getAll().then((users => socket.emit('online-users', users)));

    })
};

module.exports = {
    middleware,
    onConnect,
};
