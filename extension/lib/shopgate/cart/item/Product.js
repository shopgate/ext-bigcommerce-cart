const ShopgateCartProductPrice = require('./ProductPrice')

class ShopgateCartItemProduct {
  /**
   * @param {string} id
   * @param {string} name
   * @param {ShopgateCartAdditionalInfo[]} additionalInfo
   * @param {string} featuredImageUrl
   * @param {ShopgateCartItemProductProperty[]} properties
   * @param {ShopgateCartItemProductPrice} price
   * @param {ShopgateCartItemProductAppliedDiscount[]} appliedDiscounts
   */
  constructor ({id, name, additionalInfo, featuredImageUrl, properties, price, appliedDiscounts}) {
    this.id = id
    this.name = name
    this.additionalInfo = additionalInfo
    this.featuredImageUrl = featuredImageUrl
    this.properties = properties
    this.price = price
    this.appliedDiscounts = appliedDiscounts
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
}

module.exports = ShopgateCartItemProduct
