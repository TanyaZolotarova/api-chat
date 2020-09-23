const users = require('../controllers/user_controller');
const router = require('express').Router();
const db = require('../models');


router.get('/', (req, res) => {
    db.user.findAll().then((userList) => {
        res.send(userList);
    });
});
// router.get('/', users.findAll);
router.post('/', users.findOne);
// router.delete('/:id', users.delete);
// router.post('/logout', users.logout);
// router.put('/:id/update', users.update);


module.exports = router;