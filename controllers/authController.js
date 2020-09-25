const { authUser } = require("../services/usersService");

exports.login = async (req, res) => {

        if(!req.body.email || !req.body.password ){
            return res.status(422).send({
                    message: "Invalid Data!"
                });
        }

        const data =  await authUser(req.body);

        if(!data){
            return res.status(422).send({
                    message: "Invalid Password!"
                });
        }

        return res.send(data)
};

exports.me = async (req, res) => {
    return res.json(res.locals.user);
}
