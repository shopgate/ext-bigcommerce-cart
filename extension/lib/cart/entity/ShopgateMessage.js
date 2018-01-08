class ShopgateMessage {
  /**
   * @param {'error'|'warning'|'info'} type
   * @param {string} message
   * @param {number} code
   */
  constructor ({type, message, code}) {
    this.type = type
    this.message = message
    this.code = code
  }
}

module.exports = ShopgateMessage
