const {getUser, getAll, deleteUser} = require("../services/usersService");


exports.logout = async (req, res) => {

}

exports.findAll = async (req, res) => {
    try {
        const users = await getAll();
        res.json(users);
    } catch (err) {
        res.status(422).send({
            message:
                err.message || "Some error occurred while retrieving users."
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
                err.message || "Some error occurred while retrieving users."
        });
    }

}

exports.delete = async (req, res) => {
    const id = req.params.id;

    try{
    const user = await deleteUser(id)
        (num => {
        if (num === 1) {
            res.send({
                message: 'User was deleted successfully!'
            })
        } else {
            res.send({
                message: `Cannot delete User with id=${id}`
            })
        }
    }) catch (err) {
        res.status(422).send({
              message: `Cannot delete User with id=${id}`
        });
    }
}}

// exports.logout =  (req, res) => {
//     User.findOne({
//         where: {
//             token: req.body.token
//         }
//     }).then(user => {
//
//         user.update({token: null})
//             .then((user) =>
//                 res.status(200).send({user})
//             )
//             .catch((err) => res.status(400).send(err));
//
//     }).catch(err => res.status(400).send(err))
// }

// exports.update = (req, res) => {
//     const id = +req.params.id;
//     const {email, name} = req.body;
//
//     User.findByPk(id).then( (user) =>
//         user.update({
//             email,
//             name,
//         }) .then(function (user) {
//             res.json(user);
//             res.end();
//         }).catch(function (err) {
//             res.status(400).send(err);
//         })
//     ).catch( err => {
//         res.status(400).send('User not found');
//     })
//
// };
//
//
// exports.findById = (req, res) => {
//     const id = req.params.id;
//
//     User.findOne({
//         where: {
//             id
//         },
//         include: [
//             'messages'
//         ],
//     }).then(function (user) {
//         res.json(user);
//         res.end();
//     })
// };