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
   * @param  s
   * @returns {string}
   * @private
   */
  _bin2hex (s) {
    // From: http://phpjs.org/functions
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   bugfixed by: Linuxworld
    // +   improved by: ntoniazzi (http://phpjs.org/functions/bin2hex:361#comment_177616)
    let i
    let l = null
    let o = ''
    let n = null

    s += ''

    for (i = 0, l = s.length; i < l; i++) {
      n = s.charCodeAt(i).toString(16)
      o += n.length < 2 ? '0' + n : n
    }

    return o
  }
}

module.exports = jwtFactory
