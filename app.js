const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.use(bodyParser.json());    //
app.use(cors());                //
app.use(bodyParser.urlencoded({extended: true}));

// Middle ware registration
app.get('/', (req, res) => {     // req - all  res -
    res.json({message: 'welcome to application.'})
});

module.exports = app;
