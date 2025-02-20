// server/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// ユーザー登録
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
      password: hashedPassword
    });
    await newUser.save();

    return res.status(201).json({ message: 'User created. Awaiting admin approval.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// ユーザーログイン
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

    // シンプルにログイン成功を返す (本来はJWTなどを返す)
    return res.status(200).json({ 
      message: 'Login successful.',
      user: {
        id: user._id,
        username: user.username,
        isApproved: user.isApproved
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// 管理者によるユーザー承認 (例: admin権限を前提としたAPI)
router.post('/approve', async (req, res) => {
  try {
    const { userId } = req.body;
    // 本来はここでadminチェックを行う
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

module.exports = router;
