const authController = require('../controllers/authController');
const router = require('express').Router();
const auth = require('../middleware/auth');




router.post('/', authController.login);

router.get('/me', auth, authController.me);



router.get("/logout", (req, res) => {
    req.logout();
    res.send(req.user);
});


module.exports = router;