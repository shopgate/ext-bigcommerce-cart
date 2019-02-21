const BigCommerceCartLineItemAbstract = require('./Abstract')
const BigCommerceCartLineItemPhysicalOption = require('./physical_item/Option')

class BigCommerceCartLineItemPhysical extends BigCommerceCartLineItemAbstract {
  /**
   * @param {string} id
   * @param {number} productId
   * @param {number} variantId
   * @param {string} name
   * @param {string} sku
   * @param {string} url
   * @param {number} quantity
   * @param {boolean} isTaxable
   * @param {string} imageUrl
   * @param {number} listPrice
   * @param {number} salePrice
   * @param {boolean} isRequireShipping
   * @param {boolean} giftWrapping
   */
  constructor (id, productId, variantId, name, sku, url, quantity, isTaxable, imageUrl, listPrice, salePrice, isRequireShipping, giftWrapping) {
    super(id, productId, variantId, name, sku, url, quantity, isTaxable, imageUrl, listPrice, salePrice)
    this._isRequireShipping = isRequireShipping
    this._giftWrapping = giftWrapping
    this._options = []
  }

  /**
   * @param {number} id
   * @param {string} name
   * @param {string} value
   * @param {number} valueId
   * @returns BigCommerceCartLineItemPhysical
   */
  addOption (id, name, value, valueId) {
    this._options.push(new BigCommerceCartLineItemPhysicalOption({ id, name, value, valueId }))
    return this
  }

  /**
   * @return {BigCommerceCartLineItemPhysicalOption[]}
   */
  get options () {
    return this._options
  }

  get isRequireShipping () {
    return this._isRequireShipping
  }

  get giftWrapping () {
    return this._giftWrapping
  }
}

module.exports = BigCommerceCartLineItemPhysical
