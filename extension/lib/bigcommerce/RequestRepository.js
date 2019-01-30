const Logger = require('./Logger')

class BigCommerceRequestRepository {
  /**
   * @param {BigCommerce} client Api V3 client
   * @param {context.log} logger
   */
  constructor (client, logger) {
    this.client = client
    this.logger = logger
  }

  async get (path) {
    return this.request('get', path)
  }

  async post (path, data) {
    return this.request('post', path, data)
  }

  async put (path, data) {
    return this.request('put', path, data)
  }

  async del (path) {
    return this.request('delete', path)
  }

  /**
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

      return e
    }
  }
}

module.exports = BigCommerceRequestRepository
