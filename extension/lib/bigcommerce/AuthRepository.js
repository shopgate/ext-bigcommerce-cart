const jwt = require('jwt-simple')
const crypto = require('crypto')
const BigCommerceFactory = require('../bigcommerce/Factory')

/**
 * @property {string} _clientId
 * @property {string} _storeHash
 * @property {string} _clientSecret
 */
class BigCommerceAuthRepository {
  /**
   * @param {string} clientId
   * @param {string} storeHash
   * @param {string} clientSecret
   */
  constructor (clientId, storeHash, clientSecret) {
    this._clientId = clientId
    this._storeHash = storeHash
    this._clientSecret = clientSecret
  }

  /**
   * @param {string} customerId
   * @param {string} redirectLink
   * @param {context} context
   */
  async preAuthToken (customerId, redirectLink, context) {
    const { time } = await getBIGCServerTime(context)
    const payload = {
      iss: this._clientId,
      iat: time,
      jti: crypto.randomBytes(32).toString('hex'),
      operation: 'customer_login',
      store_hash: this._storeHash,
      customer_id: customerId,
      redirect_to: redirectLink
    }

    return jwt.encode(payload, this._clientSecret, 'HS256', {})
  }

  static create (clientId, storeHash, clientSecret) {
    return new BigCommerceAuthRepository(clientId, storeHash, clientSecret)
  }
}

/**
 * @param {context} context
 * @returns {number}
 */
async function getBIGCServerTime (context) {
  const apiClientV2 = BigCommerceFactory.createV2(
    context.config.clientId,
    context.config.accessToken,
    context.config.storeHash
  )
  return apiClientV2.get('/time')
}

module.exports = BigCommerceAuthRepository
