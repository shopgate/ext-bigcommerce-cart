module.exports = class {
  /**
   * @param {context.log} logger The extension's context.log object.
   */
  constructor (logger) {
    this.logger = logger
  }

  /**
   * @param {Object} requestOptions
   * @param {Object} response A response object of the "request" module
   */
  log (requestOptions, response = {}) {
    const logRequest = Object.assign({}, requestOptions)
    const logResponse = response === null ? {} : Object.assign({}, response)

    if (logResponse.data && typeof logResponse.data !== 'string') {
      logResponse.data = JSON.stringify(logResponse.data, null, 2)
    }

    if (logRequest.data && typeof logRequest.data !== 'string') {
      logRequest.data = JSON.stringify(logRequest.data, null, 2)
    }

    this.logger.debug({
      duration: logResponse.elapsedTime || 0,
      statusCode: logResponse.statusCode || 0,
      bigCommerceRequest: {
        request: logRequest,
        response: {
          headers: logResponse.headers ? JSON.stringify(logResponse.headers, null, 2) : '',
          body: logResponse.data
        }
      }
    }, 'Request to BigCommerce')
  }
}
