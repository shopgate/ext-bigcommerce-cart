const jwt = require('jwt-simple')
const randomBytes = require('randombytes')

/**
 * @property {string} _clientId
 * @property {string} _storeHash
 * @property {string} _clientSecret
 */
class jwtFactory {
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
   */
  create (customerId) {
    const payload = {
      iss: this._clientId,
      iat: Math.round((new Date()).getTime() / 1000),
      jti: this._hexIt(randomBytes(32)),
      operation: 'customer_login',
      store_hash: this._storeHash,
      customer_id: customerId
    }
  }

  /**
   * @param {string} a
   * @returns {string}
   * @private
   */
  _hexIt (a) {
    let hexV = ''
    for (let x = 0; x < a.length; x++) {
      hexV += a.charCodeAt(x).toString(16)
    }
    return hexV
  }
}

module.exports = jwtFactory
