const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, default: 'pending' },
  userId: String,
  date: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema);

// Middleware
const auth = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.json({ success: false, msg: 'No token!' });
  try {
    const decoded = jwt.verify(token, 'secret123');
    req.userId = decoded.id;
    next();
  } catch {
    res.json({ success: false, msg: 'Invalid token!' });
  }
};

// Get all tasks
router.get('/', auth, async (req, res) => {
  const tasks = await Task.find({ userId: req.userId });
  res.json(tasks);
});

// Create task
router.post('/', auth, async (req, res) => {
  const { title, description } = req.body;
  const task = new Task({ title, description, userId: req.userId });
  await task.save();
  res.json({ success: true, task });
});

// Update task
router.put('/:id', auth, async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json({ success: true, task });
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ success: true, msg: 'Deleted!' });
});

module.exports = router;