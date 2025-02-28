const express = require('express');
const router = express.Router();

const RoundController = require('./round.controller');

router.get('/status', RoundController.getRoundStatus);
router.post('/close', RoundController.closeRound);
router.post('/resolve-outcome', RoundController.resolveOutcome);

module.exports = router;
