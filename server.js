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


app.get('/', (req, res) => {
    res.json({message: 'welcome to application.'})
});

app.use('/auth', authRouter);

// set port, listen for request
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server is running on port http://localhost:${PORT}`)

})



