const BigCommerceCartLineItemAbstract = require('./Abstract')

class BigCommerceCartLineItemPhysical extends BigCommerceCartLineItemAbstract {
  /**
   * @param {string} id
   * @param {number} productId
   * @param {number} variantId
   * @param {string} name
   * @param {string} url
   * @param {number} quantity
   * @param {boolean} isTaxable
   * @param {string} imageUrl
   * @param {number} listPrice
   * @param {number} salePrice
   * @param {boolean} isRequireShipping
   * @param {boolean} giftWrapping
   */
  constructor (id, productId, variantId, name, url, quantity, isTaxable, imageUrl, listPrice, salePrice, isRequireShipping, giftWrapping) {
    super(id, productId, variantId, name, url, quantity, isTaxable, imageUrl, listPrice, salePrice)
    this._isRequireShipping = isRequireShipping
    this._giftWrapping = giftWrapping
  }

  get isRequireShipping () {
    return this._isRequireShipping
  }

  get giftWrapping () {
    return this._giftWrapping
  }
}

module.exports = BigCommerceCartLineItemPhysical
