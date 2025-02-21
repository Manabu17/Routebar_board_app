// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const boardRoutes = require('./routes/boards');

// 環境変数などを使う場合はdotenvなどをインストールして設定
// require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 例: MongoDB接続 (ローカル or Atlas)
mongoose.connect('mongodb://localhost:27017/election-map')
.then(() => {
  console.log('MongoDB connected.');
})
.catch((err) => {
  console.error(err);
});

// ルーティング設定
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
