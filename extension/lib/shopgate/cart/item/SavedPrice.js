class ShopgateCartItemSavedPrice {
  /**
   * @param {number} value
   * @param {ShopgateCartItemSavedPriceType.PERCENTAGE|ShopgateCartItemSavedPriceType.FIXED} type
   */
  constructor ({value, type}) {
    this._value = value
    this._type = type
  }

  /**
   * @return {number}
   */
  get value () {
    return this._value
  }

  /**
   * @return {*}
   */
  get type () {
    return this._type
  }
}

module.exports = ShopgateCartItemSavedPrice
