const { authUser } = require("../services/userService");

exports.auth = async (req, res) => {
        if(!req.body.name || !req.body.password ){
            return res.status(401).send({
                    message: "Invalid Data!"
                });
        }

        const data =  await authUser(req.body);
        return res.send(data)
};
