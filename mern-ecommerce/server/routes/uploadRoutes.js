const router = require('express').Router();
const { upload } = require('../config/cloudinary');
const { protect, admin } = require('../middleware/authMiddleware');
// POST /api/upload - admin uploads product images to Cloudinary
router.post('/', protect, admin, upload.array('images', 5), (req, res) => {
  const files = req.files.map((f) => ({ url: f.path, public_id: f.filename }));
  res.json(files);
});
module.exports = router;
