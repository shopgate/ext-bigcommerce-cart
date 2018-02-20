class BigCommerceCartLineItemUpdateRequest {
  /**
   * @param {string} itemId
   * @param {number} quantity
   *
   */
  constructor (itemId, quantity) {
    this._itemId = itemId
    this._quantity = quantity
  }

  /**
   * @returns {number}
   */
  get quantity () {
    return this._quantity
  }

  /**
   * @return {string}
   */
  get itemId () {
    return this._itemId
  }
}

module.exports = BigCommerceCartLineItemUpdateRequest
