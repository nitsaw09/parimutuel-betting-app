const httpCodeMsg = require("./http/httpCodeMsg");

/**
 * Sends a success response with the given data, message, and status code.
 * @param {Object} res - The response object.
 * @param {Object} options - The options object.
 * @param {any} options.data - The data to be included in the response has object or array of object.
 * @param {string} [options.message=''] - The message to be included in the response.
 * @param {number} [options.statusCode=200] - The status code to be set in the response.
 */
const successResponse = (res, {
    data, 
    message = '', 
    statusCode = 200
}) => {
    res.status(statusCode).json({
      success: true,
      data,
      message
    });
  };

/**
 * Sends an error response with the given error object and status code.
 * @param {Object} res - The response object.
 * @param {Object} error - The error object.
 */  
const errorResponse = (res, error) => {
    let { statusCode = 500, message } = error;
    if (statusCode === 500) {
      message = httpCodeMsg[500];
    }
    console.error(error);
    res.status(statusCode).json({
      error: true,
      message
    });
};
  
module.exports = { successResponse, errorResponse };