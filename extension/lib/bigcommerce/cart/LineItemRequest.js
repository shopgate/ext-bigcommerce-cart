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

  get quantity () {}
  get productId () {}
  get variantId () {}
}

module.exports = BigCommerceCartLineItemRequest
