// server/models/Board.js
const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
  name: { type: String, required: true },    // 掲示板の識別名
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  status: { type: String, default: '未済' },  // "未済" or "貼付済"
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date }, // 貼付済に変更された日付
}, { timestamps: true });

module.exports = mongoose.model('Board', BoardSchema);
