const router = require('express').Router();
const c = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');
router.use(protect, admin);
router.get('/dashboard', c.dashboard);
router.get('/users', c.listUsers);
module.exports = router;
