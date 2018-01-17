class BigCommerceCartLineItemRequest {
  /**
   * @param {number} productId
   * @param {number} quantity
   * @param {?number|null} variantId
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

  /**
   * @returns BigCommerceCartLineItemRequest
   */
  toReadModel () {
    let readModel = {
      product_id: this._productId,
      quantity: this._quantity
    }

    if (this.variantId) {
      readModel.variant_id = this._varriantId
    }

    return readModel
  }
}

module.exports = BigCommerceCartLineItemRequest
