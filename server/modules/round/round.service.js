const httpCodes = require("../../utils/http/httpCodes");
const HttpException = require("../../utils/http/httpException");
const RoundModel = require("../../models/round");
const BetModel = require("../../models/bet");

class RoundService {
    /**
     * Retrieves the status of the current round and the total bets placed so far.
     * @returns {Object} An object with the roundId, status, totalBets, poolA, and poolB properties.
     * @property {number} roundId - The id of the current round.
     * @property {string} status - The status of the current round.
     * @property {number} totalBets - The total number of bets placed in the current round.
     * @property {number} poolA - The total amount of bets placed on outcome A in the current round.
     * @property {number} poolB - The total amount of bets placed on outcome B in the current round.
    */
    async getRoundStatus() {
        const currentRound = await RoundModel.findOne({ 
            contractAddress: process.env.CONTRACT_ADDRESS
        });
        if (!currentRound) {
            throw new HttpException(httpCodes.BAD_REQUEST, 'No active betting round');
        }
      
        const bets = await BetModel.find({ round: currentRound._id });
      
        const totals = bets.reduce((acc, bet) => {
            acc[bet.outcome] = (acc[bet.outcome] || 0) + bet.amount;
            return acc;
        }, { 1: 0, 2: 0 });
        console.log(totals);
        return {
            roundId: currentRound._id,
            status: currentRound.status,
            totalBets: bets.length,
            poolA: totals['1'] || 0,
            poolB: totals['2'] || 0
        };
    }

    /**
     * Closes the current round and prevents any more bets from being placed.
     * @returns {Object} The updated round document with the status set to 'closed'.
    */
    async closeRound() {
        const currentRound = await RoundModel.findOne({ 
            contractAddress: process.env.CONTRACT_ADDRESS, 
            status: 'open' 
        });
        if (!currentRound) {
            throw new HttpException(httpCodes.BAD_REQUEST, 'Betting is already closed');
        }
      
        currentRound.status = 'closed';
        await currentRound.save();
      
        return currentRound;
    }

    /**
     * Resolves the current round by setting the winning outcome and preventing any more
     * bets from being placed or resolved.
     * @param {Object} params - An object with a single property, winningOutcome, which
     *  is the outcome of the round (1 or 2).
     * @returns {Object} The updated round document with the status set to 'resolved' and
     *  the winningOutcome set to the given value.
     * @throws {HttpException} If betting is already finalized.
    */
    async resolveOutcome({ winningOutcome }) {
        const currentRound = await RoundModel.findOne({ 
            contractAddress: process.env.CONTRACT_ADDRESS, 
            status: { $ne: 'resolved' } 
        });
        if (!currentRound) {
            throw new HttpException(httpCodes.BAD_REQUEST, 'Betting is already finalized');
        }
        
        const updatedRound = await RoundModel.updateOne(
            { _id: currentRound._id },
            { $set: { status: 'resolved', winningOutcome } }
        );
        return updatedRound;
    }
      
}

module.exports = RoundService;