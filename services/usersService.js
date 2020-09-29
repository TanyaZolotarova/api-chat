const bcrypt = require("bcrypt");
const User = require('../models').user;
const jwt = require("jsonwebtoken");
const config = require('../config/auth.config.js');
const {secret} = require('../config/auth.config');

const getAll = () => {
    return User.findAll({
        attributes: ['email', 'role', 'name', 'isBanned']
    });
}

const getUser = (id) => {
    return User.findByPk(id, {
        attributes: ['id', 'email', 'role', 'name','password', 'isBanned']
    });
}

const getUserByToken = (token) => {
    const decoded = jwt.decode(token, secret);

    return (decoded ? getUser(decoded.id) : null);
};

const deleteUser = (id) => {
    return User.destroy({where: {id}});
}


const updateUser = async (id, data) => {

    const upUser = await User.findByPk(id);
    return upUser.update(data);
}

const createUser = async (data) => {

    const createUser = await User.build();
    createUser.email = data.email;
    createUser.password = bcrypt.hashSync(data.password, 8);
    createUser.name = data.name || data.email.split('@')[0];
    // createUser.name = data.name;
    createUser.googleId = data.googleId || null;
        createUser.isBunned = 0;

    return await createUser.save();
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

const authUserByGoogle = async (data) => {

    const findUser = await User.findOne({
        where: {googleId: data.googleId}
    });

    if (findUser) {
        return {
            user: {id: findUser.id, name: findUser.name, email: findUser.email},
            token: await generateToken(findUser.id),
        };
    }

    const newUser = await createUser(data);
    return {
        user: {id: newUser.id, name: newUser.name, email: newUser.email},
        token: await generateToken(newUser.id),
    };

}

const authUser = async ({email, password}) => {

    const findUser = await User.findOne({
        where: {email}
    });

    if (findUser) {
        if (findUser.googleId) {
            return false;
        }

        //login
        const passwordIsValid = bcrypt.compareSync(
            password,
            findUser.password
        );

        if (!passwordIsValid) {
            return false;
        }

        return {
            user: {id: findUser.id, email: findUser.email},
            token: await generateToken(findUser.id),
        };

    }

    const newUser = await createUser({email, password});
    return {
        user: {id: newUser.id, email: newUser.email, name: newUser.name, isBanned: newUser.isBanned},
        token: await generateToken(newUser.id),
    };
}

const updateUserProfile = async (id, data) => {

    const upProfile = await user.findByPk(id);
    return upProfile.update(data);
}

module.exports = {
    createUser,
    loginUser,
    authUserByGoogle,
    authUser,
    getUser,
    getUserByToken,
    getAll,
    deleteUser,
    updateUser,
    updateUserProfile,
}