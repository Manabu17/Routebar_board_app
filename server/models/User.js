// server/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
  role: { type: String, default: 'user' }, // 追加：'user' または 'admin'
  organizationId: { type: String } // 組織ID（任意）
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
