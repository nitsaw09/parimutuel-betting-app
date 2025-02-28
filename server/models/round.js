const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
  contractAddress: {
    type: String,
    index: true,
    required: true
  },
  status: { 
    type: String, 
    required: true, 
    enum: ['open', 'closed', 'resolved', 'finalized'], 
    default: 'open' 
  },
  winningOutcome: { 
    type: String,
    default: null 
  },
  startTime: { 
    type: Date, 
    default: Date.now 
  },
  endTime: { 
    type: Date 
  }
});

module.exports = mongoose.model('Round', roundSchema);
