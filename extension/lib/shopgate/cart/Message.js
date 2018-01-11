class ShopgateCartMessage {
  /**
   * @param {ShopgateCartItemMessageType.ERROR|ShopgateCartItemMessageType.WARNING|ShopgateCartItemMessageType.INFO} type
   * @param {string} message
   * @param {number} code
   */
  constructor ({type, message, code}) {
    this._type = type
    this._message = message
    this._code = code
  }

  /**
   *@return {ShopgateCartItemMessageType.ERROR|ShopgateCartItemMessageType.WARNING|ShopgateCartItemMessageType.INFO}
   */
  get type () {
    return this._type
  }

  /**
   *@return {string}
   */
  get message () {
    return this._message
  }

  /**
   *@return {number}
   */
  get code () {
    return this._code
  }

}

module.exports = ShopgateCartMessage
