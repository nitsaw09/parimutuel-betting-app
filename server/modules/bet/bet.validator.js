const Joi = require('joi');
const { joiErrorsHandler, options } = require('../../utils/validator');
const { isAddress } = require('ethers');

const schemas = {
    placeBet: Joi.object().keys({
        body: Joi.object().keys({
            walletAddress: Joi.string().custom((value, helpers) => {
                if (!isAddress(value)) {
                    return helpers.error("any.invalid");
                }
                return value;
            }, "Ethereum Address Validation").required(),
            outcome: Joi.string().required(),
            amount: Joi.number().greater(0).required()
        })
    })
};

module.exports = {                                                                                       
    placeBet: async (req, res, next) => {
        const schema = schemas.placeBet;
        const { body } = req;
        const payload = { body };
        let option = options.basic;
        const { error, value } = schema.validate(payload, option);
        if (error) {
            return joiErrorsHandler(res, error);
        } 
        if (value) next();
    }
}