const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const authRouter = require('./routes/authRoutes');

const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

app.use(cors());
app.use(bodyParser.json());

// Middle ware registration
app.get('/', (req, res) => {     // req - all  res -
    res.json({message: 'welcome to application.'})
});

app.use('/auth', authRouter);


// Listen port
server.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`);
});

// Array with connections
connections = [];

// == SYSTEM EVENT ==  Function, which runs when connecting client;
io.sockets.on('connection', function (socket) {
    console.log("Connected successfully");
    // Adding new connection into array;
    connections.push(socket);


    // == CUSTOM EVENT ==  Function, receiving a message from any client;
    socket.on('message', function ({name, message}) {
        console.log('====[ send_message ]==========>', name + ':', message);
        // Inside of the function we sending an event 'add_message',
        // which will show up a new message for all connected clients;
        io.sockets.emit('add_message', {name, message});
    });


    // == SYSTEM EVENT ==  Function, which runs when client disconnected from server;
    socket.on('disconnect', function (data) {
        // Removing an user from array of 'connections';
        connections.splice(connections.indexOf(socket), 1);
        console.log("Disconnected");
    });


});



