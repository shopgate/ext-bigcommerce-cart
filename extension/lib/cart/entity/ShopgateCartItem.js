class ShopgateCartItem {
  /**
   * @param {string} id
   * @param {number} quantity
   * @param {'product'|'coupon'}type
   * @param {object} coupon
   * @param {ShopgateCartProduct} product
   * @param {ShopgateMessage[]} messages
   */
  constructor ({ id, quantity, type, coupon, product, messages }) {
    this.id = id
    this.quantity = quantity
    this.type = type
    this.coupon = coupon
    this.product = product
    this.messages = messages
  }
}

module.exports = ShopgateCartItem
