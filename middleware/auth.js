const db = require('../models');
const user = db.user;


const {secret} = require('../config/auth.config');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decodedToken = jwt.decode(token, secret);
        const user_id = decodedToken.id;
        const user = await user.findByPk(user_id, {
            include: [
                'messages'
            ]
        });
        if (!user) {
            res.status(401).json({
                error: 'Invalid data'
            });
        } else {
            res.locals.user = user;
            next();
        }
    } catch {
        res.status(401).json({
            error: 'Invalid request!'
        });
    }
};