const express = require('express');
const router = express.Router();
const BetController = require('./bet.controller');
const betValidator = require('./bet.validator');

router.post('/place-bet', betValidator.placeBet, BetController.placeBet);

router.get('/:walletAddress', BetController.getBets);

module.exports = router;