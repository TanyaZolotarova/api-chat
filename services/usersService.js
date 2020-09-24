const bcrypt = require("bcrypt");
const db = require('../models');
const user = db.user;
const jwt = require("jsonwebtoken");
const config = require('../config/auth.config.js');

const createUser = (data) => {
    const createUser = user.build();

    createUser.password = bcrypt.hashSync(data.password, 8);
    createUser.email = data.email;

    return createUser.save();
};

const loginUser = (user) => {
    // const expiresIn = 24 * 60 * 60  // in seconds 24 hours;
    const expiresIn = 120 * 2  // 2 min

    return jwt.sign({id: user.id}, config.secret, {
        expiresIn
    });
}

const generateToken = (id) => {
    const expiresIn = 120 * 2  // 2 min

    return jwt.sign({id}, config.secret, {
        expiresIn
    });
}

const authUser =  async ({email, password}) => {

    const findUser = await user.findOne({
        where: {email}
    });

    if (findUser) {
        //login
        const passwordIsValid = bcrypt.compareSync(
            password,
            findUser.password
        );

        if (!passwordIsValid) {

            return false;
        }

        return {
            user: { id: findUser.id, email: findUser.email},
            token : await generateToken(findUser.id),
        };

    }

        const newUser = await createUser({email, password});
        return {
            user: { id: newUser.id, email: newUser.email},
            token: await generateToken(newUser.id),
        };



}
module.exports = {
    createUser,
    loginUser,
    authUser
}