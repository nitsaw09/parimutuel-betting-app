const { successResponse, errorResponse } = require("../../utils/response");
const RoundService = require("./round.service");
const Logger = require("../../utils/logger");
const { successMsg } = require("./constants");

const roundService = new RoundService();

const logger = new Logger("RoundController");

class RoundController {
    
    /**
     * Retrieves the status of the current round and the total bets placed so far.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Object} The response object with an object containing the roundId, status, totalBets, poolA, and poolB properties.
     * @throws {HttpException} If betting is already finalized.
    */
    static async getRoundStatus(req, res) {
        try {
            const round = await roundService.getRoundStatus();
            return successResponse(res, { data: round });
        } catch (error) {
            logger.error(`Error: ${error.message}`);
            return errorResponse(res, error);
        }
    }

    /**
     * Closes the current round and prevents any more bets from being placed.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Object} The response object with the updated round document and a success message.
     * @throws {HttpException} If betting is already closed.
    */
    static async closeRound(req, res) {
        try {
            const round = await roundService.closeRound();
            return successResponse(res, { data: round, message: successMsg.ROUND_CLOSED });
        } catch (error) {
            logger.error(`Error: ${error.message}`);
            return errorResponse(res, error);
        }
    }

    /**
     * Resolves the current round by setting the winning outcome and preventing any more
     * bets from being placed or resolved.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Object} The response object with the updated round document and a success message.
     * @throws {HttpException} If betting is already finalized.
    */
    static async resolveOutcome(req, res) {
        try {
            const { winningOutcome } = req.body;
            const round = await roundService.resolveOutcome({ winningOutcome });
            return successResponse(res, { data: round, message: successMsg.RESOLVE_OUTCOME });
        } catch (error) {
            logger.error(`Error: ${error.message}`);
            return errorResponse(res, error);
        }
    }
}

module.exports = RoundController;