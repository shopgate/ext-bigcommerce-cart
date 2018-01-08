class BigcommerceLineItem {
  /**
   * @param {string} productId
   * @param {string} varriantId
   * @param {number} quantity
   */
  constructor ({productId, varriantId, quantity}) {
    this.product_id = productId
    this.varriant_id = varriantId
    this.quantity = quantity
  }
}

module.exports = BigcommerceLineItem
