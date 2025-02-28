const BetModel = require('../../models/bet.js');
const RoundModel = require('../../models/round.js');
const DepositModel = require('../../models/deposit.js');
const httpCodes = require('../../utils/http/httpCodes.js');
const HttpException = require('../../utils/http/httpException.js');
const Logger = require('../../utils/logger');

class BetService {
    logger = new Logger(BetService.name);
    
    /**
     * Places a bet in the current round.
     * @param {Object} params - An object with the following properties:
     * @param {string} params.walletAddress - The Ethereum wallet address of the user.
     * @param {number} params.outcome - The outcome of the bet (1 or 2).
     * @param {number} params.amount - The amount of the bet.
     * @returns {Object} The created bet document.
     * @throws {HttpException} If betting is already closed or the user does not have sufficient funds.
    */
    async placeBet({ walletAddress, outcome, amount }) {
        const currentRound = await RoundModel.findOne({ 
            contractAddress: process.env.CONTRACT_ADDRESS, 
            status: 'open' 
        });
        if (!currentRound) {
            throw new HttpException(httpCodes.BAD_REQUEST, 'Betting is already closed');
        }
        const depositedAmount = await DepositModel.findOne({ walletAddress });
        if (!depositedAmount || depositedAmount.amount < amount) {
            throw new HttpException(httpCodes.BAD_REQUEST, 'Insufficient funds to place bet');
        }

        await DepositModel.updateOne(
            { walletAddress }, // Filter by wallet address
            { $inc: { amount: -amount } }, // Decrement the amount
        ); // Update the deposit amount

        const newBet = await BetModel.create({ 
            walletAddress, 
            outcome, 
            amount, 
            round: currentRound._id 
        });
        this.logger.info('Bet placed successfully');
        return newBet;
    }

    
    /**
     * Retrieves the bets of a given user in the current round.
     * @param {Object} params - An object with the following properties:
     * @param {string} params.walletAddress - The Ethereum wallet address of the user.
     * @returns {Object[]} An array of bet documents.
     * @throws {HttpException} If betting is already closed.
    */
    async getBets({ walletAddress }) {
        const currentRound = await RoundModel.findOne({ 
            contractAddress: process.env.CONTRACT_ADDRESS
        });
        if (!currentRound) {
            throw new HttpException(httpCodes.BAD_REQUEST, 'No active betting round');
        }
        const bets = await BetModel
          .find({ 
            walletAddress, 
            round: currentRound._id 
          })
          .sort({ timestamp: -1 });
        return bets;
    }
}

module.exports = BetService;