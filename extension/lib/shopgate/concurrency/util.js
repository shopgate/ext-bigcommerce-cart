const nonce = require('mini-nonce')
/**
 * @param {number} ms
 * @returns {Promise}
 */
function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * @param {number} [length=32]
 * @return {string}
 */
function randomString (length = 32) {
  return nonce(length, 'string')
}

module.exports = {
  sleep,
  randomString
}
