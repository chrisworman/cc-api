const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportByUserId: {
    type: String,
    required: true,
  },
  items: {
    type: Map,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  createdOn: {
    type: Date,
    required: true,
    default: Date.now,
  },
  notes: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model('report', reportSchema);