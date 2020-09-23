const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const userRouter = require('./routes/userRoutes');

const users = require('./routes/userRoutes')

app.use(cors());
app.use(bodyParser.json());
app.use('/users', users);

app.get('/', (req, res) => {
    res.json({message: 'welcome to application.'})
});

app.use('/users', userRouter);

// set port, listen for request
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server is running on port http://localhost:${PORT}`)

})


// socket.io
const httpServer = require('http').createServer((req, res) => {
  // serve the index.html file
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(content));
  res.end(content);
});

const io = require('socket.io')(httpServer);

io.on('connect', socket => {
  console.log('connect');
});

httpServer.listen(3000, () => {
  console.log('go to http://localhost:3000');
});
