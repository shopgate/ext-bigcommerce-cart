class ShopgateCartItemCoupon {
  /**
   * @param {string} code
   * @param {string} description
   * @param {string} label
   * @param {ShopgateCartItemSavedPrice} savedPrice
   */
  constructor ({code, description, label, savedPrice}) {
    this._code = code
    this._description = description
    this._label = label
    this._savedPrice = savedPrice
  }

  /**
   *@return {string}
   */
  get code () {
    return this._code
  }

  /**
   *@return {string}
   */
  get description () {
    return this._description
  }

  /**
   *@return {string}
   */
  get label () {
    return this._label
  }

  /**
   *@return {ShopgateCartItemSavedPrice}
   */
  get savedPrice () {
    return this._savedPrice
  }
}

module.exports = ShopgateCartItemCoupon
