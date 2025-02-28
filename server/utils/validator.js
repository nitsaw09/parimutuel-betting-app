const HttpException = require('./http/httpException');
const httpCodes = require('./http/httpCodes');
const { errorResponse } = require('./response');

exports.options = {
    basic: {
      abortEarly: false,
      convert: true,
      allowUnknown: false,
      stripUnknown: true
    },
  
    array: {
      abortEarly: false,
      convert: true,
      allowUnknown: true,
      stripUnknown: {
        objects: true
      }
    }
};

exports.joiErrorsHandler = (res, err) => {
    try {
        let error = err.details.reduce((prev, curr) => {
            prev[curr.path[0]] = curr.message.replace(/"/g, '');
            return prev;
        }, {});
        const errorMsg = error.query || error.body || error.params;
        throw new HttpException(httpCodes.BAD_REQUEST, errorMsg)
    } catch (error) {
        return errorResponse(res, error);
    }
}