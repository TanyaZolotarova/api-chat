const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const authRouter = require('./routes/authRoutes');
const usersRouter = require('./routes/usersRoutes');

const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const authConfig = require ('./config/auth.config');
const db = require('./models');
const user = db.user;
const cookieSession = require("cookie-session");

app.use(cors());
app.use(bodyParser.json());


//google-authorization
passport.use(
    new GoogleStrategy({
      clientID: authConfig.google.clientID,
      clientSecret: authConfig.google.clientSecret,
      callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        // passport callback function
        //check if user already exists in our db with the given profile ID

        console.log('GoogleStrategy', profile);
        user.findOne({
            where :{ googleId: profile.id}
        }).then((currentUser) => {
            if (currentUser) {
                //if we already have a record with the given profile ID
                done(null, currentUser);
            } else {
                //if not, create a new user
                new user({
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    name: profile.name,
                }).save().then((newUser) => {
                    done(null, newUser);
                });
            }
        })
    })
);


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    //findById
    user.findByPk(id).then(user => {
        done(null, user);
    });
});

app.use(cookieSession({
    // milliseconds of a day
    maxAge: 24*60*60*1000,
    keys:[authConfig.session.cookieKey]
}));

app.use(passport.initialize());
app.use(passport.session());


// Middle ware registration
app.get('/', (req, res) => {     // req - all  res -
    res.json({message: 'welcome to application.'})
});

app.use('/auth', authRouter);
app.use('/users', usersRouter);

app.get('/auth', (req, res)=> {
    res.json({message: 'welcome to auth.'})
})

app.post("/auth/google",
    passport.authenticate('google', {
        scope: ["profile", "email"]
    })
);

app.get("/auth/google", passport.authenticate('google', {
    scope: ["profile", "email"]
}));

app.get("/auth/google/redirect",passport.authenticate('google'), (req,res) =>{
    res.send(req.user);
    res.send("you reached the redirect URI");
});


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



