const express = require('express');
const router = express.Router();
const User = require('../models/user');
const AuthUser = require('../models/authUser');
const Session = require('../models/session');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const password = req.query.password;
        if (!password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const user = await User.findOne({ email });
        if (user == null) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        
        const authUser = await AuthUser.findOne({ userId: user._id });
        if (!authUser || !authUser.hashedPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        if (!bcrypt.compareSync(password, authUser.hashedPassword)) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const session = await Session.findOne({ userId: user._id });
        if (session) {
            return res.json(session);
        } else { // lazily create session
            const newSession = new Session({
                userId: user._id,
            });
            const savedSession = await newSession.save();
            return res.status(201).json(savedSession);
        }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  module.exports = router;