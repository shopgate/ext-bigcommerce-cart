class ShopgateCartProduct {
  /**
   * @param {string} id
   * @param {string} name
   * @param {array} addtionalInfo
   * @param {string} featuredImageUrl
   * @param {ShopgateCartProductProperty[]} properties
   * @param {ShopgateCartProductPrice} price
   * @param {array} appliedDiscounts
   */
  constructor ({id, name, addtionalInfo, featuredImageUrl, properties, price, appliedDiscounts}) {
    this.id = id
    this.name = name
    this.addtionalInfo = addtionalInfo
    this.featuredImageUrl = featuredImageUrl
    this.properties = properties
    this.price = price
    this.appliedDiscounts = appliedDiscounts
  }
}

module.exports = ShopgateCartProduct
