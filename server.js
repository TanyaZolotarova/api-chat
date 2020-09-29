// import * as jwt from "jsonwebtoken";
const jwt = require('jsonwebtoken');
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();
const db = require('./models');
const user = db.user;
const google = require('./middleware/google');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/usersRoutes');

// const options = {
//     key: fs.readFileSync('./key.pem', 'utf8'),
//     cert: fs.readFileSync('./server.crt', 'utf8')
// };
// const server = https.createServer(options, app);

const server = require('http').createServer(app);

const io = require('socket.io').listen(server);
const cookieSession = require('cookie-session');

const {getChatMessages, addChatMessages} = require("./services/messagesService");
const {getChatMembersIDs, getUserChats, getAllChats} = require("./services/chatsService");
const {getUserByToken} = require("./services/usersService");


app.use(cors());
app.use(bodyParser.json());

app.use(cookieSession({
    // milliseconds of a day
    maxAge: 24 * 60 * 60 * 1000,
    keys: ["my-secret-key"]
}));


// Middle ware registration
app.get('/', (req, res) => {     // req - all  res -
    res.json({message: 'welcome to application.'})
});

app.use('/auth', authRouter);
app.use('/user', userRouter);

app.post('/auth/google', google);


// Listen port
server.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`);
});

// socket middleware
io.use(async (socket, next) => {
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
});

// == SYSTEM EVENT ==  Function, which runs when connecting client;
io.sockets.on('connection', function (socket) {
    console.log("Connected successfully  " + new Date().toTimeString());

    // console.log('User:', socket.user.name);
    // console.log('User.role:', socket.user.role);
    // console.log('User.isBanned:', socket.user.isBanned);

    if (socket.user.role === 'user') {
        getUserChats(socket.user.id).then((chatsList) => {
            socket.emit('chatsList', chatsList);
        })
     }


    // socket.emit('message', {});
    // io.sockets.clients((err, clients) => {
    //     if (err) {
    //         console.error(err);
    //         return;
    //     }
    //
    //     console.log('CLIENTS', clients);
    //     console.log(io.sockets.sockets[clients[0]]);
    // });

    // io.on('connection', async (socket) => {
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
    //
        if (user.isBanned){
            socket.destroy();
            return;
        }

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
    // io.sockets.emit('newOnLineUser', {name, id, text});

    if (socket.user.role === 'admin') {
        getAllChats().then((chatsList) => {
            socket.emit('chatsList', chatsList);
        }
        )

        socket.on('sendGlobalMessage', function ({text}) {
            //         // console.log('====[ send_message ]==========>', name +':', id,  text);
            //         // Inside of the function we sending an event 'add_message',
            //         // which will show up a new message for all connected clients;
            const name = socket.user.name;
            const id = socket.user.id;

            io.sockets.emit('add_message', {name, id, text, chatId: 1});
        });

        socket.on('ban', function ({id}) {
            io.sockets.forEach((sck)=>{
                if (sck.user.id === id){
                    // save to db before disconnect;

                    sck.disconnect();
                }
            });
        })


        socket.on('mute', function ({id}) {
            io.sockets.forEach((sck)=>{
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
    socket.on('message', function ({text, chatId}) {
        console.log(`MESSAGE RECEIVED FROM ${socket.user.name}`, text, chatId);
        // console.log('socket.user ON MESSAGE', socket.user);
        // Inside of the function we sending an event 'add_message',
        // which will show up a new message for all connected clients;

        // console.log(socket.user.id);
        const {name, id, muted, email } = socket.user;

        console.log("socket.user", socket.user );

        // const banned =  socket.user.isBanned;
        //
        // if(banned) {
        //     return;
        // }

        if (muted){
            return;
        }

        // проверить по времени


        // send only for needed users
        getChatMembersIDs(chatId).then((membersIDs) => {
            if (membersIDs && membersIDs.length) {
                Object.values(io.sockets.sockets).forEach((sck) => {
                    if (membersIDs.includes(sck.user.id)) {
                        sck.emit('message', {text, chatId, name, email });
                    }
                });
            }
        });

        getChatMessages(chatId).then(() => {
            // console.log("chatId", chatId);
        })

        addChatMessages({text, chatId, id}).then(() => {
            // console.log("text, chatId, id" ,text, chatId, id)
        });

        // const ids = [1,2,3,4,5]; // get user ids From db
        // io.sockets.forEach((sck)=>{
        //     if (ids.indexOf(sck.user.id) !== -1){
        //         sck.emit('add_message', {name, id, text, chatId});
        //     }
        // });

        // -- or --

        // send for all users (global)
        // io.sockets.emit('add_message', {name, id, text});
    });


    // == SYSTEM EVENT ==  Function, which runs when client disconnected from server;
    socket.on('disconnect', function (data) {
        // Removing an user from array of 'connections';
        console.log("Disconnected  " +  new Date().toTimeString());
        // io.sockets.emit('userOffline', {id});
    });
});
