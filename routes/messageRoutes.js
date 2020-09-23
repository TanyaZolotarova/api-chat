const router = require('express').Router();

router.get('/', messages.findAll);
router.get('/one', messages.findOne);
router.post('/', messages.create);
router.get('/:id', messages.findById);

module.exports = router;