const db = require('../models');
const user = db.user;

const {secret} = require('../config/auth.config');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decodedToken = jwt.decode(token, secret);
        const id = decodedToken.id;

        const userMe =  await user.findOne({
            where: {id},
            attributes: [
                'name',
                'role'
            ]

        })

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