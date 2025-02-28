const mongoose = require('mongoose');
const RoundModel = require('../models/round');

// Initialize first round if none exists
const initializeFirstRound = async () => {
    try {
      const existingRound = await RoundModel.findOne({ 
        contractAddress: process.env.CONTRACT_ADDRESS 
      });
      if (!existingRound) {
      const firstRound = new RoundModel({ 
          status: 'open',
          contractAddress: process.env.CONTRACT_ADDRESS 
      });
      await firstRound.save();
      console.log('First round initialized');
      }
    } catch (error) {
      console.error('Error initializing first round:', error);
    }
};

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * Utilizes environment variable MONGO_URI for connection details.
 * Logs the host name upon successful connection.
 * Exits the process on connection failure.
 * 
 * @throws Will throw an error if connection fails.
 */
const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/betting');
        console.log(`MongoDB Connected`);
        await initializeFirstRound();
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1); // Exit process on failure
    }
};

module.exports = dbConnect;