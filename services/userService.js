const bcrypt = require("bcrypt");
const db = require('../models');
const user = db.user;
const jwt = require("jsonwebtoken");
const config = require('../config/auth.config.js');


const createUser = (data) => {
    const createUser = user.build();

    createUser.password = bcrypt.hashSync(data.password, 8);
    createUser.name = data.name;

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

const authUser =  async ({name, password}) => {

    const findUser = await user.findOne({
        where: {name}
    });

    if (findUser) {
        //login
        const passwordIsValid = bcrypt.compareSync(
            password,
            findUser.password
        );

        if (!passwordIsValid) {
            return {
                message: "Invalid Password!"
            };
        }

        return {
            user: { id: findUser.id, name: findUser.name},
            token : await generateToken(findUser.id),
        };

    } else {

        const user = await createUser({name, password});
        return {
            user: { id: user.id, name: user.name},
            token: await generateToken(user.id),
        };

    }

}
module.exports = {
    createUser,
    loginUser,
    authUser
}