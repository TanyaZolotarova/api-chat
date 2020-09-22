const bcrypt = require("bcrypt");
const db = require('../models');
const user = db.user;
const jwt = require("jsonwebtoken");
const config = require('../config/auth.config.js');


const createUser = (data) => {
    const createUser = user.build();
    createUser.password = bcrypt.hashSync(data.password, 8);
    createUser.user_name = data.user_name;
    return createUser.save();
};

const loginUser = (user) => {
    // const expiresIn = 24 * 60 * 60  // in seconds 24 hours;
    const expiresIn = 120 * 2  // 2 min
    return jwt.sign({id: user.id}, config.secret, {
        expiresIn
    });
}

module.exports = {
    createUser,
    loginUser,
}