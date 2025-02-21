// 例: server/routes/admin.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');

// 管理者チェック用の簡単な例
function checkAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admins only.' });
  }
}

// 管理者専用ルート
router.get('/dashboard', authenticateToken, checkAdmin, (req, res) => {
  res.status(200).json({ message: 'Welcome to the admin dashboard.' });
});

module.exports = router;
