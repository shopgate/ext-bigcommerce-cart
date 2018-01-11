const PRODUCT = 'product'
const COUPON = 'coupon'
class ShopgateCartItemType {
  constructor () {
    this._PRODUCT = PRODUCT
    this._COUPON = COUPON
  }

  /**
   *@return {string}
   */
  get PRODUCT () {
    return this._PRODUCT
  }

  /**
   *@return {string}
   */
  get COUPON () {
    return this._COUPON
  }
}

module.exports = ShopgateCartItemType
