const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const google = require('./middleware/google');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/usersRoutes');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const webSocketController = require('./controllers/webSocketsController');
const cookieSession = require('cookie-session');


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

io.use(webSocketController.middleware); // socket middleware

// == SYSTEM EVENT ==  Function, which runs when connecting client;
io.sockets.on('connection', webSocketController.onConnect);
