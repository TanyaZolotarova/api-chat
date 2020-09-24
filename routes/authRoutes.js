const authController = require('../controllers/authController');
const router = require('express').Router();
const auth = require('../middleware/auth');
const passport = require("passport");


router.post('/', authController.login);
router.get('/me', auth, authController.me);

// Google

// router.get("/google/redirect",passport.authenticate("google"),(req,res)=>{
//     res.send(req.user);
//     console.log("authRoutes ", req.user)
//     res.send("you reached the redirect URI");
// });

//app.get
router.get("/logout", (req, res) => {
    req.logout();
    res.send(req.user);
});


module.exports = router;