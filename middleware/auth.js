const { getUserByToken } = require("../services/usersService");

module.exports = async (req, res, next) => {
    try {
        const userMe = await getUserByToken(req.headers.authorization);


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