const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    index: true
  },
  outcome: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  round: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Round', 
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Bet', betSchema);