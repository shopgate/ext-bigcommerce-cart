class ShopgateCartMessage {
  /**
   * @param {string} type - enum ShopgateCartItemMessageType
   * @param {string} message
   * @param {number} code
   */
  constructor (type, message, code) {
    this.type = type
    this.message = message
    this.code = code
  }
}

module.exports = ShopgateCartMessage
