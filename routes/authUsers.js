const express = require('express');
const router = express.Router();
const AuthUser = require('../models/authUser');
const bcrypt = require('bcrypt');

router.put('/', async (req, res) => {
    try {
        const password = req.body.password;
        if (!password) {
            return res.status(400).json({ message: 'No password' });
        }

        const hashedPassword = await bcrypt.hash(password, 5);
        const existingAuthUser = await AuthUser.findOne({ userId: req.user._id });
        if (existingAuthUser) {
            existingAuthUser.hashedPassword = hashedPassword;
            await existingAuthUser.save();
            return res.status(204).json({ message: 'Updated' });
        }

        const newAuthUser = new AuthUser({
            userId: req.user._id,
            hashedPassword,
        });
        await newAuthUser.save();
        res.status(201).json({ message: 'Created' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  module.exports = router;