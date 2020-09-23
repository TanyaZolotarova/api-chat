const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const authRouter = require('./routes/authRoutes');

const users = require('./routes/authRoutes')

app.use(cors());
app.use(bodyParser.json());


// Middle ware registration
app.get('/', (req, res) => {     // req - all  res -
  res.json({message: 'welcome to application.'})
});

app.use('/auth', authRouter);

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


