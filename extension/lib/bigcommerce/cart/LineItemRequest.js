class BigCommerceCartLineItemRequest {
  /**
   * @param {number} productId
   * @param {number} quantity
   * @param {number|null} variantId
   */
  constructor (productId, quantity, variantId = null) {
    this._productId = productId
    this._varriantId = variantId
    this._quantity = quantity
  }

  /**
   * @returns {number}
   */
  get quantity () {
    return this._quantity
  }

  /**
   * @returns {string}
   */
  get productId () {
    return this._productId
  }

  /**
   * @returns {number|null}
   */
  get variantId () {
    return this._varriantId
  }
}

module.exports = BigCommerceCartLineItemRequest
