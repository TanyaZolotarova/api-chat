const {authUserByGoogle} = require("../services/usersService");


module.exports = async (req, res, next) => {
    try {
        const {googleId, email, givenName, familyName} = req.body.user;

        const data = {
            email,
            googleId,
            name: `${givenName} ${familyName}`,
            password: email
        };

        const user = await authUserByGoogle(data);

        if (!user) {
            return res.status(422).send({
                message: "Invalid Password!"
            });
        }

        return res.send(user);
    } catch {
        res.status(401).json({
            error: 'Invalid request!'
        });
    }
};