const jwt = require('jwt-simple')
const crypto = require('crypto')

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
   */
  preAuthToken (customerId, redirectLink) {
    const payload = {
      iss: this._clientId,
      iat: Math.round((new Date()).getTime() / 1000),
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

module.exports = BigCommerceAuthRepository
