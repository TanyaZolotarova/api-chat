const authController = require('../controllers/authController');
const router = require('express').Router();
const auth = require('../middleware/auth');


// router.get('/', users.findAll);
router.post('/', authController.login);
// router.delete('/:id', users.delete);
// router.post('/logout', users.logout);
// router.put('/:id/update', users.update);

router.get('/me', auth, authController.me);


module.exports = router;