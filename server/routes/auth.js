const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.send('User registered');
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user && user.password === req.body.password) {
    res.send('Login successful');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

module.exports = router;