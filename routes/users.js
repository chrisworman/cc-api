const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

router.get('/:id', getUser, (req, res) => {
    res.json(res.user);
});

router.post('/', async (req, res) => {
  try {
      const email = req.body.email;
      if (!email || email.indexOf('@') < 0) {
          return res.status(400).json({ message: 'Missing or invalid email' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(409).json({ message: 'Duplicate email address' });
      }

      const newUser = new User({
          email,
      });
      await newUser.save();
      res.status(201).json({ message: 'Created' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

async function getUser(req, res, next) {
    let user
    try {
      user = await User.findById(req.params.id);
      if (user == null) {
        return res.status(404).json({ message: 'Cannot find user' });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  
    res.user = user;
    next();
}
  
module.exports = router;