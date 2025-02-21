// server/middleware/checkAdmin.js
module.exports = (req, res, next) => {
    // ※ここでは仮に、req.user にログイン済みユーザー情報が入っている前提です
    if (req.user && req.user.role === 'admin') {
      next(); // 管理者なら先へ
    } else {
      res.status(403).json({ message: 'Forbidden: Admins only.' });
    }
  };
  