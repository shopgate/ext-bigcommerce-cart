class ShopgateCartItemProductAppliedDiscount {
  /**
   * @param {string} code
   * @param {string} description
   * @param {string} label
   * @param {ShopgateCartItemSavedPrice} savedPrice
   */
  constructor (code, description, label, savedPrice) {
    this.code = code
    this.description = description
    this.label = label
    this.savedPrice = savedPrice
  }
}

module.exports = ShopgateCartItemProductAppliedDiscount
