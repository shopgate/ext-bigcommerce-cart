/**
 * This is actually discount with unfortunate name
 */
class ShopgateCartItemSavedPrice {
  /**
   * @param {number} value
   * @param {string} type enum ShopgateCartItemSavedPriceType
   */
  constructor (value, type) {
    this.value = value
    this.type = type
  }
}

module.exports = ShopgateCartItemSavedPrice
