const { successResponse, errorResponse } = require('../../utils/response');
const BetService = require('./bet.service');
const { successMsg } = require('./constants');
const Logger = require('../../utils/logger');

const betService = new BetService();

const logger = new Logger("BetController");

class BetController {
 
    /**
     * Places a bet in the current round.
     * @param {Object} req - The request object.
     * @param {string} req.body.walletAddress - The Ethereum wallet address of the user.
     * @param {number} req.body.outcome - The outcome of the bet (1 or 2).
     * @param {number} req.body.amount - The amount of the bet.
     * @param {Object} res - The response object.
     * @returns {Object} The response object with the created bet document and a success message.
     * @throws {HttpException} If betting is already closed or the user does not have sufficient funds.
    */
   static async placeBet(req, res) {
        try {
            const { walletAddress, outcome, amount } = req.body;
            const newBet = await betService.placeBet({ walletAddress, outcome, amount });
            return successResponse(res, { data: newBet, message: successMsg.PLACED_BET });
        } catch (error) {
            logger.error(`Error: ${error.message}`);
            return errorResponse(res, error);
        }
    }

    /**
     * Retrieves the bets of a given user in the current round.
     * @param {Object} req - The request object.
     * @param {string} req.params.walletAddress - The Ethereum wallet address of the user.
     * @param {Object} res - The response object.
     * @returns {Object} The response object with an array of bet documents.
     * @throws {HttpException} If betting is already closed.
    */
    static async getBets(req, res) {
        const { walletAddress } = req.params;
        try {
            const bets = await betService.getBets({ walletAddress });
            return successResponse(res, { data: bets });
        } catch (error) {
            logger.error(`Error: ${error.message}`);
            return errorResponse(res, error);
        }
    }       
};

module.exports = BetController;