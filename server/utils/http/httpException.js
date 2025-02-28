const httpCodeMsg = require("./httpCodeMsg");

class HttpException extends Error {
    /**
     * Creates a new instance of the HttpException class.
     * @param {number} statusCode - The HTTP status code.
     * @param {string} message - The error message.
     */
    constructor(statusCode, message) {
      super(message); 
      this.statusCode = statusCode;
      this.message = message || httpCodeMsg[statusCode];
    }
}
  
module.exports = HttpException;