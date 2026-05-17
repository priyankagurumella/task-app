const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});

const User = mongoose.model('User', userSchema);

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();
    res.json({ success: true, msg: '✅ Registered!' });
  } catch (err) {
    res.status(500).json({ success: false, msg: '❌ Error!' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, msg: 'User not found!' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ success: false, msg: 'Wrong password!' });
    const token = jwt.sign({ id: user._id }, 'secret123', { expiresIn: '1d' });
    res.json({ success: true, token, name: user.name });
  } catch (err) {
    res.status(500).json({ success: false, msg: '❌ Error!' });
  }
});

module.exports = router;