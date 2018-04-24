const jwt = require('jwt-simple')
const randomBytes = require('randombytes')

/**
 * @property {string} _clientId
 * @property {string} _storeHash
 * @property {string} _clientSecret
 */
class JwtFactory {
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
  create (customerId, redirectLink) {
    const payload = {
      iss: this._clientId,
      iat: Math.round((new Date()).getTime() / 1000),
      jti: this._bin2hex(randomBytes(32)),
      operation: 'customer_login',
      store_hash: this._storeHash,
      customer_id: customerId
    }
    if (redirectLink) {
      payload.redirect_to = redirectLink
    }

    return jwt.encode(payload, this._clientSecret)
  }

  /**
   * @param  binary
   * @returns {string}
   * @private
   */
  _bin2hex (binary) {
    let op = ''
    binary += ''

    for (let i = 0; i < binary.length; i++) {
      let hexChar = binary.charCodeAt(i).toString(16)
      op += hexChar.length < 2 ? '0' + hexChar : hexChar
    }

    return op
  }
}

module.exports = JwtFactory
