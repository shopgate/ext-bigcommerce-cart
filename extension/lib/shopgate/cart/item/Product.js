const ShopgateCartProductPrice = require('./ProductPrice')

class ShopgateCartItemProduct {
  /**
   * @param {string} id
   * @param {string} name
   * @param {ShopgateCartAdditionalInfo[]} addtionalInfo
   * @param {string} featuredImageUrl
   * @param {ShopgateCartItemProductProperty[]} properties
   * @param {ShopgateCartItemProductPrice} price
   * @param {ShopgateCartItemProductAppliedDiscount[]} appliedDiscounts
   */
  constructor ({id, name, addtionalInfo, featuredImageUrl, properties, price, appliedDiscounts}) {
    this._id = id
    this._name = name
    this._addtionalInfo = addtionalInfo
    this._featuredImageUrl = featuredImageUrl
    this._properties = properties
    this._price = price
    this._appliedDiscounts = appliedDiscounts
  }

  static createPrice (listPrice, defaultPrice, special) {
    return new ShopgateCartProductPrice({
      unit: listPrice,
      defaultPrice: defaultPrice,
      special: special
    })
  }

  /**
   * @return {string}
   */
  get id () {
    return this._id
  }

  /**
   * @return {string}
   */
  get name () {
    return this._name
  }

  /**
   * @return {ShopgateCartAdditionalInfo[]}
   */
  get addtionalInfo () {
    return this._addtionalInfo
  }

  /**
   * @return {string}
   */
  get featuredImageUrl () {
    return this._featuredImageUrl
  }

  /**
   * @return {ShopgateCartItemProductProperty[]}
   */
  get properties () {
    return this._properties
  }

  /**
   * @return {ShopgateCartItemProductPrice}
   */
  get price () {
    return this._price
  }

  /**
   * @return {ShopgateCartItemProductAppliedDiscount[]}
   */
  get appliedDiscounts () {
    return this._appliedDiscounts
  }
}

module.exports = ShopgateCartItemProduct
