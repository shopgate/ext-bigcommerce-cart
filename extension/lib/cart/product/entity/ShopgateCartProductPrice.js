class ShopgateCartProductPrice {
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

module.exports = ShopgateCartProductPrice
