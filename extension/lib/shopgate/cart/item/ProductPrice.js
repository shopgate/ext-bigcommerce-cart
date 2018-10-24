class ShopgateCartItemProductPrice {
  /**
   * @param {number} unit
   * @param {number} defaultPrice
   * @param {number} special
   */
  constructor ({unit, defaultPrice, special}) {
    this.unit = unit
    this.default = defaultPrice
    this.special = special
  }
}

module.exports = ShopgateCartItemProductPrice
