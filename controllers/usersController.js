const {getUser, getAllUsers, deleteUser, updateUser, updateUserProfile} = require("../services/usersService");


exports.logout = async (req, res) => {
    try {

    } catch (err) {
        res.status(422).send({
            message:
                err.message || "Can't logout."
        });
    }
}

exports.findAll = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(422).send({
            message:
                err.message || "Some error occurred while getting users."
        });
    }

}

exports.findOne = async (req, res) => {

    const id = req.params.id;

    try {
        const user = await getUser(id);
        res.json(user);

    } catch (err) {
        res.status(422).send({
            message:
                err.message || "Some error occurred while getting users."
        });
    }

}

exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        const num = await deleteUser(id);

        if (num === 1) {
            res.send({
                message: 'User was deleted successfully!'
            })
        } else {
            res.status(404).send({
                message: `Can't find user with id=${id}`
            })
        }
    } catch (err) {
        res.status(422).send({
            message: `Can't delete user with id=${id}`
        });
    }
}


exports.update = async (req, res) => {
    const id = req.params.id;
    const {role, name, email} = req.body;

    try {
        const user = await getUser(id);
        if (!user) {
            res.status(404).send({
                message: ` User not found`
            })
        }

        const userUpdated = await updateUser(id, {role, name, email});

        // console.log(userUpdated);
        res.json(userUpdated);

    } catch (err) {
        res.status(422).send({
            message:
                err.message || "Some error occurred while getting users."
        });
    }

};

exports.userProfileFromChat = async (req, res) => {
    const id = req.params.id;
    console.log(  req.body);
    const {name, email, password} = req.body;

    try {
        const user = await getUser(id);
        if (!user) {
            res.status(404).send({
                message: ` User not found`
            })
        }

        let profileUpdated;

        if (password && password.length > 0) {
            profileUpdated = await updateUserProfile(id, {name, email, password});

        } else {
            profileUpdated = await updateUserProfile(id, {name, email});
        }

       //  if(!password){
        // profileUpdated =  updateUserProfile(id, {name, email});
        //
        //  } else {
        //        profileUpdated = await updateUserProfile(id, {name, email, password});
        //  }

        // const profileUpdated = await updateUserProfile(id, {name, email, password});

        res.json(profileUpdated);

    } catch (err) {
        res.status(422).send({
            message:
                err.message || "Some error occurred while getting users."
        });
    }


}




