// server/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isApproved: { type: Boolean, default: false }, // 管理者承認済かどうか
  role: { type: String, default: 'user' } // admin権限などをつけるなら
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
