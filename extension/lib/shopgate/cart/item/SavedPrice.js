/**
 * This is actually discount with unfortunate name
 */
class ShopgateCartItemSavedPrice {
  /**
   * @param {number} value
   * @param {string} type enum ShopgateCartItemSavedPriceType
   */
  constructor (value, type) {
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
