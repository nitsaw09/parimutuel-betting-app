const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const betRotes = require('./modules/bet/bet.route');
const roundRoutes = require('./modules/round/round.route');
const RoundModel = require('./models/round');
const dbConnect = require('./config/dbConnect');

dotenv.config();

dbConnect();

require('./contracts/contractEvents');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// api routes
app.use('/api/v1/bets', betRotes);
app.use('/api/v1/rounds', roundRoutes);
  
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});