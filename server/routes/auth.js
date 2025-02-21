// server/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authenticateToken'); // JWT検証用ミドルウェア
const checkAdmin = require('../middleware/checkAdmin');

// ユーザー登録（organizationId は後で管理者が設定する前提）
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    // ユーザー重複チェック
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists.' });
    }
    // パスワードハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword, // organizationId は空のまま登録
    });
    await newUser.save();
    return res.status(201).json({ message: 'User created. Awaiting admin approval.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// ユーザーログイン（JWT発行）
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // 承認済か確認
    if (!user.isApproved) {
      return res.status(403).json({ message: 'User not approved by admin.' });
    }
    // パスワードチェック
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    // JWTトークンの生成
    const token = jwt.sign(
      { id: user._id, role: user.role },
      'your-secret-key', // 実際は環境変数で管理するのが望ましい
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        username: user.username,
        isApproved: user.isApproved,
        role: user.role,
        organizationId: user.organizationId,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// 管理者によるユーザー承認 (例: admin権限を前提としたAPI)
router.post('/approve', authenticateToken, checkAdmin, async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    user.isApproved = true;
    await user.save();
    return res.status(200).json({ message: 'User approved.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// 全ユーザー一覧を取得（承認済・未承認両方、組織IDも含む）
router.get('/users', authenticateToken, checkAdmin, async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// ユーザー削除エンドポイント
router.delete('/users/:id', authenticateToken, checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    return res.status(200).json({ message: 'User deleted.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
