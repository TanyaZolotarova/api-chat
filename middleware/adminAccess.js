const db = require('../models');
const user = db.user;

const {secret} = require('../config/auth.config');
const jwt = require('jsonwebtoken');


module.exports = async (req, res, next) => {

    try {
        const token = req.headers.authorization;
        const decodedToken = jwt.decode(token, secret);
        const id = decodedToken.id;

        const admin =  await user.findOne({
            where: {id}
        })

        if (admin.role === 'admin') {
            res.locals.user = admin;
            next();

        } else {

            res.status(401).json({
                error: 'Permission denied!'
            });
        }

    } catch {
        res.status(401).json({
            error: 'Invalid request!'
        });
    }
};