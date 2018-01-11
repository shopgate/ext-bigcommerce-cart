class BigCommerceCart {
  /**
   * @param {string} id
   * @param {Object} bigCommerceCartData
   */
  constructor (id, bigCommerceCartData) {
    this._id = id
    this._bigCommerceCartData = bigCommerceCartData
  }

  /**
   * BigCommerce cart identifier
   *
   * @returns {string}
   */
  get id () {
    return this._id
  }

  /**
   * Creates new line item.
   *
   * @param {number} quantity
   * @param {number} productId
   * @returns {BigCommerceCartLineItemRequest}
   */
  createLineItem (quantity, productId) {}

  /**
   * @returns {BigCommerceCartLineItems}
   */
  get lineItems () {}

  get currency () {}

  get baseAmount () {}

  get discountAmount () {}

  get cartAmount () {}

  get taxIncluded () {}
}

module.exports = BigCommerceCart
