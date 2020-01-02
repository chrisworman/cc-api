const mongoose = require('mongoose');

const authUserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  hashedPassword: {
      type: String,
      required: true,
  },
  createdOn: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model('authUser', authUserSchema);