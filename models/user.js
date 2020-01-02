const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    createdOn: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

module.exports = mongoose.model('user', userSchema);