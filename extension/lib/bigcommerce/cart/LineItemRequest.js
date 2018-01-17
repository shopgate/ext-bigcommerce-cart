class BigCommerceCartLineItemRequest {
  /**
   * @param {string} productId
   * @param {string} varriantId
   * @param {number} quantity
   */
  constructor ({productId, varriantId, quantity}) {
    this._product_id = productId
    this._varriant_id = varriantId
    this._quantity = quantity
  }

  get quantity () {
    return this._quantity
  }
  get productId () {
    return this._product_id
  }
  get variantId () {
    return this._varriant_id
  }
}

module.exports = BigCommerceCartLineItemRequest
