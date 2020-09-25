const db = require('../models');
const user = db.user;

const {secret} = require('../config/auth.config');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {


    try {
        const token = req.headers.authorization;
        const decodedToken = jwt.decode(token, secret);
        const id = decodedToken.id;
        const data = {token};

        const userMe =  await user.findOne({
            where: {id},
            attributes: [
                'email',
                'role',
            ]
        })


        // if (userMe.attributes.bunned === true) {
        //     res.status(422).json({
        //         error: 'You are bunned'
        //     });
        // }

        if (!userMe) {
            res.status(401).json({
                error: 'Invalid data'
            });
        } else {
            res.locals.user = userMe;
            next();
        }
    } catch {
        res.status(401).json({
            error: 'Invalid request!'
        });
    }
};