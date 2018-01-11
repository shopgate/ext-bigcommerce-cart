// aggregate, entity
class ShopgateCartItem {
  /**
   * @param {string} id
   * @param {number} quantity
   * @param {ShopgateCartItemType.PRODUCT|ShopgateCartItemType.COUPON} type
   * @param {ShopgateCartItemCoupon} coupon
   * @param {ShopgateCartItemProduct} product
   * @param {ShopgateCartMessage[]} messages
   */
  constructor ({ id, quantity, type, coupon, product, messages }) {
    this._id = id
    this._quantity = quantity
    this._type = type
    this._coupon = coupon
    this._product = product
    this._messages = messages
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
   * @return {ShopgateCartItemType.PRODUCT|ShopgateCartItemType.COUPON}
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
}

module.exports = ShopgateCartItem
