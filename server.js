const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', (req, res) => {
    res.json({message: 'welcome to application.'})
});

// set port, listen for request
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
