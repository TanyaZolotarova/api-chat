const authController = require('../controllers/authController');
const router = require('express').Router();
const auth = require('../middleware/auth');


router.post('/', authController.login);
router.get('/me', auth, authController.me);


module.exports = router;