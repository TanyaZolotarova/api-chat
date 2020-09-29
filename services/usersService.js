const bcrypt = require("bcrypt");
const db = require('../models');
const user = db.user;
const jwt = require("jsonwebtoken");
const config = require('../config/auth.config.js');

const getAll = () => {
    return user.findAll({
        attributes: ['email', 'role', 'name']
    });
}

const getUser = (id) => {
    return user.findByPk(id, {
        attributes: ['email', 'role', 'name', 'password']
    });
}

const deleteUser = (id) => {
    return user.destroy({where: {id}});
}


const updateUser = async (id, data) => {

    const upUser = await user.findByPk(id);
    return upUser.update(data);
}

const createUser = async (data) => {

    const createUser = await user.build();
    createUser.email = data.email;
    createUser.password = bcrypt.hashSync(data.password, 8);
    createUser.name = data.name || data.email.split('@')[0];
    // createUser.name = data.name;
    createUser.googleId = data.googleId || null;

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

    const findUser = await user.findOne({
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

    const findUser = await user.findOne({
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
        user: {id: newUser.id, email: newUser.email, name: newUser.name},
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
    getAll,
    deleteUser,
    updateUser,
    updateUserProfile,
}