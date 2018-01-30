class BigCommerceCartLineItemUpdateRequest {
  /**
   * @param {string} itemId
   * @param {number} productId
   * @param {number} quantity
   *
   */
  constructor (itemId, productId, quantity) {
    this._itemId = itemId
    this._productId = productId
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
   * @return {string}
   */
  get itemId () {
    return this._itemId
  }

  /**
   * @returns {number|null}
   */
  get variantId () {
    return this._varriantId
  }
}

module.exports = BigCommerceCartLineItemUpdateRequest
