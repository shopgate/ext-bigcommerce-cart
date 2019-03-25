// aggregate, entity
class ShopgateCartItem {
  /**
   * @param {string} id
   * @param {number} quantity
   * @param {string} type enum ShopgateCartItemType
   * @param {ShopgateCartItemCoupon} coupon
   * @param {ShopgateCartItemProduct} product
   */
  constructor ({ id, quantity, type, coupon, product }) {
    this._id = id
    this._quantity = quantity
    this._type = type
    this._coupon = coupon
    this._product = product
    this._messages = []
  }

  /**
   * @return {string}
   */
  get id () {
    return this._id
  }

  /**
   * @return {number}
   */
  get quantity () {
    return this._quantity
  }

  /**
   * @return {string} enum ShopgateCartItemType
   */
  get type () {
    return this._type
  }

  /**
   * @return {ShopgateCartItemCoupon}
   */
  get coupon () {
    return this._coupon
  }

  /**
   * @returns {ShopgateCartItemProduct}
   */
  get product () {
    return this._product
  }

  /**
    @return {ShopgateCartMessage[]}
   */
  get messages () {
    return this._messages
  }

  /**
   * @param {ShopgateCartMessage} message
   */
  addMessage (message) {
    this.messages.push(message)
  }
}

module.exports = ShopgateCartItem
