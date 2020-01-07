const express = require('express');
const router = express.Router();
const User = require('../models/user');
const AuthUser = require('../models/authUser');
const Session = require('../models/session');
const bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');

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

        const newAuthUser = new AuthUser({
            userId: newUser._id,
            hashedPassword: 'invite-pending',
        });
        await newAuthUser.save();

        const session = new Session({
            userId: newUser._id,
        });
        await session.save();

        const ccEmail = process.env.CC_EMAIL;
        const ccPassword = process.env.CC_EMAIL_PWD;
        console.log('ccEmail=' + ccEmail + ' ccPassword=' + ccPassword);
        const emailTransporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: ccEmail,
              pass: ccPassword,
            }
          });
          
        const mailOptions = {
            from: ccEmail,
            to: email,
            subject: 'Welcome to the Community Cleanup app',
            html: '<p>You have been invited by ' 
                    + req.user.email 
                    + ' to the Community Cleanup app. Please click the following link to choose your password.</p><br />'
                    + '<a href="https://www.community-cleanup.org?inviteToken=' + encodeURIComponent(session._id.toString()) + '">Choose Password</a>',
          };
          
          emailTransporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log('Error sending invite email: ');
                console.log(error);
                res.status(500).json({ message: 'Error sending email: ' + error });
            } else {
                res.status(201).json({ message: "An invite email has been sent to " + email });
            }
          });

    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  module.exports = router;