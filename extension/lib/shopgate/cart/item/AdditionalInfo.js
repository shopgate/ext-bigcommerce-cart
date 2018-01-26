class ShopgateCartAdditionalInfo {
  /**
   * @param {string} label
   * @param {string} value
   */
  constructor ({label, value}) {
    this._label = label
    this._value = value
  }

  /**
   * @return {string}
   */
  get label () {
    return this._label
  }

  /**
   *  @return {string}
   */
  get value () {
    return this._value
  }
}

module.exports = ShopgateCartAdditionalInfo
