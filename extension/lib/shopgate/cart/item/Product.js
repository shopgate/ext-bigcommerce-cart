const ShopgateCartProductPrice = require('./ProductPrice')

class ShopgateCartItemProduct {
  /**
   * @param {string} id
   * @param {string} variantId
   * @param {string} name
   * @param {ShopgateCartAdditionalInfo[]} additionalInfo
   * @param {string} featuredImageUrl
   * @param {ShopgateCartItemProductProperty[]} properties
   * @param {ShopgateCartItemProductPrice} price
   * @param {ShopgateCartItemProductAppliedDiscount[]} appliedDiscounts
   */
  constructor ({ id, variantId, name, additionalInfo, featuredImageUrl, properties, price, appliedDiscounts }) {
    this._id = id
    this._variantId = variantId
    this._name = name
    this._additionalInfo = additionalInfo
    this._featuredImageUrl = featuredImageUrl
    this._properties = properties
    this._price = price
    this._appliedDiscounts = appliedDiscounts
  }

  /**
   * @param {number} listPrice
   * @param {number} defaultPrice
   * @param {number} special
   * @return {ShopgateCartItemProductPrice}
   */
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
  get variantId () {
    return this._variantId
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
  get additionalInfo () {
    return this._additionalInfo
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
