const usersController = require('../controllers/usersController');
const router = require('express').Router();


router.get('/', usersController.findAll);
router.get('/:id', usersController.findOne);
router.delete('/:id', usersController.delete);
// router.put('/:id/update', usersController.update);
router.post('/logout', usersController.logout);



module.exports = router;