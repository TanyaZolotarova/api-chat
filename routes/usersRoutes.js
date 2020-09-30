const usersController = require('../controllers/usersController');
const router = require('express').Router();
const adminAccess = require('../middleware/adminAccess');

router.get('/', adminAccess , usersController.findAll);
router.get('/:id', adminAccess, usersController.findOne);
router.delete('/:id', adminAccess, usersController.delete);
router.put('/:id', adminAccess, usersController.update);
// router.post('/logout', usersController.logout);
router.put('/profile/:id', usersController.userProfileFromChat);


module.exports = router;