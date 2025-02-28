const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const betRotes = require('./modules/bet/bet.route');
const roundRoutes = require('./modules/round/round.route');
const dbConnect = require('./config/dbConnect');
const { errorResponse } = require('./utils/response');
const HttpException = require('./utils/http/httpException');
const httpCodes = require('./utils/http/httpCodes');

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

// handling 404 error
app.use((req, res, next) => {
  const error = new HttpException(httpCodes.NOT_FOUND);
  next(error);
});

// handling client & server error response
app.use((error, req, res, next) => {
  errorResponse(res, error);
  next();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});