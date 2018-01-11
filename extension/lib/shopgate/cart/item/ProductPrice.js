class ShopgateCartItemProductPrice {
  /**
   * @param {number} unit
   * @param {number} defaultPrice
   * @param {number} special
   */
  constructor ({unit, defaultPrice, special}) {
    this._unit = unit
    this._default = defaultPrice
    this._special = special
  }

  /**
   * @return {number}
   */
  get unit () {
    return this._unit
  }

  /**
   * @return {number}
   */
  get default () {
    return this._default
  }

  /**
   * @return {number}
   */
  get special () {
    return this._special
  }
}

module.exports = ShopgateCartItemProductPrice
