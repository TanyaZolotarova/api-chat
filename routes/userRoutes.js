const users = require('../controllers/user_controller');
const router = require('express').Router();
const auth = require('../middleware/auth');

// router.get('/', users.findAll);
router.post('/', users.auth);
// router.delete('/:id', users.delete);
// router.post('/logout', users.logout);
// router.put('/:id/update', users.update);

// router.get('/me', auth, users.me);


module.exports = router;