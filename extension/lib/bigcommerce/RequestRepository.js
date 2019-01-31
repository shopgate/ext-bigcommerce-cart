const Logger = require('./Logger')

class BigCommerceRequestRepository {
  /**
   * @param {BigCommerce} client Api V3 client
   * @param {Logger} logger context.log
   */
  constructor (client, logger) {
    this.client = client
    this.logger = logger
  }

  /**
   * @param {string} path
   * @return {BigCommerceRedirectUrlsResponse}
   */
  get (path) {
    return this.request('get', path)
  }

  /**
   * @param {string} path
   * @param {Object} data
   * @return {BigCommerceRedirectUrlsResponse}
   */
  post (path, data) {
    return this.request('post', path, data)
  }

  /**
   * @param {string} path
   * @param {Object} data
   * @return {BigCommerceRedirectUrlsResponse}
   */
  put (path, data) {
    return this.request('put', path, data)
  }

  /**
   * @param {string} path
   * @return {BigCommerceRedirectUrlsResponse}
   */
  del (path) {
    return this.request('delete', path)
  }

  /**
   * @param {string} type
   * @param {string} path
   * @param {Object} data
   * @return {BigCommerceRedirectUrlsResponse}
   */
  async request (type, path, data) {
    const request = { type, path, data }
    const logRequest = new Logger(this.logger)
    const start = new Date()

    try {
      const response = await this.client.request(type, path, data)
      logRequest.log(request, response, new Date() - start, 1)

      return response
    } catch (e) {
      logRequest.log(request, e.toString(), new Date() - start, 0)

      throw e
    }
  }
}

module.exports = BigCommerceRequestRepository
