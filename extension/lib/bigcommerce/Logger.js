class BigCommerceLogger {
  /**
   * @param {Logger} logger The extension's context.log object.
   */
  constructor (logger) {
    this.logger = logger
  }

  /**
   * @param {Object} requestOptions
   * @param {Object} response A response object of the "request" module
   * @param {number} elapsedTime
   * @param {number} success
   */
  log (requestOptions, response = '', elapsedTime = 0, success = 0) {
    const logRequest = Object.assign({}, requestOptions)
    const logResponse = JSON.stringify(response)

    this.logger.debug(
      {
        duration: elapsedTime,
        success: success,
        request: logRequest,
        response: logResponse
      },
      'Request to the BigCommerce API'
    )
  }
}

module.exports = BigCommerceLogger
