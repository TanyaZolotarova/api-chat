const { getUserByToken } = require("../services/usersService");

module.exports = async (req, res, next) => {
    try {
        const admin = await getUserByToken(req.headers.authorization);

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