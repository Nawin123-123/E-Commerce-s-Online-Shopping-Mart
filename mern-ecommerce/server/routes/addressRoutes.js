const router = require('express').Router();
const c = require('../controllers/addressController');
const { protect } = require('../middleware/authMiddleware');
router.use(protect);
router.route('/').get(c.list).post(c.create);
router.route('/:id').put(c.update).delete(c.remove);
module.exports = router;
