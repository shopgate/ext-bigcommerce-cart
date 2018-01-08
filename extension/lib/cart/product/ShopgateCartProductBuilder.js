const ShopgateCartProduct = require('./entity/ShopgateCartProduct')
const ShopgateCartProductPrice = require('./entity/ShopgateCartProductPrice')

class ShopgateCartProductBuilder {
  /**
   * @param {object} bigcommerceItem
   */
  constructor (bigcommerceItem) {
    this._bigcommerceItem = bigcommerceItem
  }

  /**
   * @return {ShopgateCartProduct}
   */
  build () {
    return new ShopgateCartProduct({
      id: this._getId(),
      name: this._getName(),
      addtionalInfo: this._getAddtionalInfo(),
      featuredImageUrl: this._getFeaturedImageUrl(),
      properties: this._getProperties(),
      price: this._getPrice(),
      appliedDiscounts: this._getAppliedDiscounts(),
    })
  }

  /**
   * @return {string}
   * @private
   */
  _getId () {
    return this._bigcommerceItem.product_id
  }

  /**
   * @return {string}
   * @private
   */
  _getName () {
    return this._bigcommerceItem.name
  }

  /**
   *  @return {Array}
   * @private
   */
  _getAddtionalInfo () {
    return []
  }

  /**
   * @return {string}
   * @private
   */
  _getFeaturedImageUrl () {
    return this._bigcommerceItem.image_url
  }

  /**
   * @return {Array}
   * @private
   */
  _getProperties () {
    return []
  }

  /**
   * @return {ShopgateCartProductPrice}
   * @private
   */
  _getPrice () {
    const listPrice = this._bigcommerceItem.list_price
    const salePrice = (this._bigcommerceItem.sale_price < listPrice) ? this._bigcommerceItem.sale_price : null
    return new ShopgateCartProductPrice({
      unit: listPrice,
      defaultPrice: listPrice * this._bigcommerceItem.quantity,
      special: salePrice
    })
  }

  /**
   * @return {Array}
   * @private
   */
  _getAppliedDiscounts() {
    return []
  }
}

module.exports = ShopgateCartProductBuilder
