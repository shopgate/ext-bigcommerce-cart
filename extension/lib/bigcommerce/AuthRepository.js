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
      // Danger! BigCommerce checks iat also if it's in the future. If servers are not entirely in sync, token would be invalid.
      // Time spent finding this out: 6h
      // Related link: https://github.com/jpadilla/pyjwt/issues/190
      iat: Math.round((new Date()).getTime() / 1000) - 20,
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
