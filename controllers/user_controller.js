const { createUser, loginUser } = require("../services/userService");
const db = require('../models');
const user = db.user;
const Op = db.sequelize.Op;
const bcrypt = require("bcrypt");

exports.findOne = async (req, res) => {
    try {
        const {body: {user_name, password}} = req;
        const findUser = await user.findOne({
            where: {user_name}
        });

        if (findUser) {
            //login
            const passwordIsValid = bcrypt.compareSync(
                password,
                findUser.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    message: "Invalid Password!"
                });
            }

            const token =  await loginUser(findUser);

            return res.status(200).send({
                findUser,
                token,
            });
        } else {
            //reg
             return res.send(await createUser({user_name, password}))
        }
    }
    catch (err) {
        console.error('findOne - ', err);
    }


}