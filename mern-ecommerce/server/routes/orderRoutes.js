const router = require('express').Router();
const c = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');
router.post('/', protect, c.create);
router.get('/mine', protect, c.myOrders);
router.get('/all', protect, admin, c.listAll);
router.get('/:id', protect, c.getById);
router.put('/:id/status', protect, admin, c.updateStatus);
module.exports = router;
