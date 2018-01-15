const ShopgateCartItemType = require('./item/Type')
const ShopgateCartItem = require('./Item')
const ShopgateCartItemProduct = require('./item/Product')
const ShopgateCartItemCoupon = require('./item/Coupon')
const ShopgateCartItemSavedPrice = require('./item/SavedPrice')

class ShopgateCartItemBuilder {
  constructor (itemId, quantity) {
    this._itemId = itemId
    this._quantity = quantity
    this._type = ShopgateCartItemType.PRODUCT
  }

  /**
   * @param {number} id
   * @return {ShopgateCartItemBuilder}
   */
  withProductId (id) {
    this._productId = id
    return this
  }

  /**
   * @param {string} name
   * @return {ShopgateCartItemBuilder}
   */
  withProductName (name) {
    this._productName = name
    return this
  }

  /**
   * @param {number} listPrice
   * @param {number} defaultPrice
   * @param {number} special
   * @return {ShopgateCartItemBuilder}
   */
  withProductPrice (listPrice, defaultPrice, special) {
    this._productPrice = ShopgateCartItemProduct.createPrice(listPrice, defaultPrice, special)
    return this
  }

  /**
   * @param {string} code
   * @param {string} description
   * @param {string} label
   * @param {number} discountAmount
   * @param {string} discountType
   * @return {ShopgateCartItemBuilder}
   */
  withCoupon (code, description, label, discountAmount, discountType) {
    this._coupon = new ShopgateCartItemCoupon(code, description, label, new ShopgateCartItemSavedPrice(discountAmount, discountType))
    return this
  }

  /**
   * @param {string} featureImageUrl
   * @return {ShopgateCartItemBuilder}
   */
  withFeatureImageUrl (featureImageUrl) {
    this._featureImageUrl = featureImageUrl
    return this
  }

  /**
   *
   */
  withProperties () {
    this._productProperties = []
    return this
  }

  /**
   * @return {ShopgateCartItem}
   */
  build () {
    let product
    if (this._productId) {
      product = new ShopgateCartItemProduct({
        id: this._productId,
        name: this._productName,
        addtionalInfo: [],
        featuredImageUrl: this._featureImageUrl,
        properties: [],
        price: this._productPrice,
        appliedDiscounts: []
      })
    }

    return new ShopgateCartItem({
      id: this._itemId,
      quantity: this._quantity,
      type: this._type,
      product: product,
      coupon: this._coupon
    })
  }
}

module.exports = ShopgateCartItemBuilder
