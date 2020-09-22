const users = require('../controllers/user_controller');
const router = require('express').Router();

// router.get('/', users.findAll);
router.post('/', users.findOne);
// router.delete('/:id', users.delete);
// router.post('/logout', users.logout);
// router.put('/:id/update', users.update);


module.exports = router;