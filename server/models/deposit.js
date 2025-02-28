const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  }
});

module.exports = mongoose.model('Deposit', depositSchema);