// aggregate, entity
class ShopgateCartItem {
  /**
   * @param {string} id
   * @param {number} quantity
   * @param {string} type enum ShopgateCartItemType
   * @param {ShopgateCartItemCoupon} coupon
   * @param {ShopgateCartItemProduct} product
   */
  constructor ({id, quantity, type, coupon, product}) {
    this.id = id
    this.quantity = quantity
    this.type = type
    this.coupon = coupon
    this.product = product
    this.messages = []
  }
}

module.exports = ShopgateCartItem
