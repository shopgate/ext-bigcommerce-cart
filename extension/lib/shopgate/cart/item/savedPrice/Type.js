const PERCENTAGE = 'percentage'
const FIXED = 'fixed'
class ShopgateCartItemSavedPriceType {
  constructor () {
    this._PERCENTAGE = PERCENTAGE
    this._FIXED = FIXED
  }

  /**
   * @return {string}
   */
  get PERCENTAGE () {
    return this._PERCENTAGE
  }
  /**
   * @return {string}
   */
  get FIXED () {
    return this._FIXED
  }
}

module.exports = ShopgateCartItemSavedPriceType
