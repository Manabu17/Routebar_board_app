// server/routes/boards.js
const express = require('express');
const router = express.Router();
const Board = require('../models/Board');

// 全掲示板取得
router.get('/', async (req, res) => {
  try {
    const boards = await Board.find().populate('updatedBy', 'username');
    return res.status(200).json(boards);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// 特定掲示板のステータスを更新 ("貼付済"にする)
router.put('/:boardId', async (req, res) => {
  try {
    const { boardId } = req.params;
    const { status, userId } = req.body; // userId はクライアントから送ってもらうか、JWTから読み取るなど

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: 'Board not found.' });
    }

    board.status = status;
    board.updatedBy = userId || board.updatedBy;
    board.updatedAt = status === '貼付済' ? new Date() : null;

    await board.save();
    return res.status(200).json({ message: 'Board status updated.', board });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
