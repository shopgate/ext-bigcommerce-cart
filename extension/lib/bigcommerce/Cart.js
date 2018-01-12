class BigCommerceCart {
  /**
   * @param {number} id
   * @param {string} currency
   * @param {string} isTaxIncluded
   * @param {number} baseAmount
   * @param {number} discountAmount
   * @param {number} cartAmount
   */
  constructor ({id, currency, isTaxIncluded, baseAmount, discountAmount, cartAmount}) {
    this._id = id
    this._currency = currency
    this._isTaxIncluded = isTaxIncluded
    this._baseAmount = baseAmount
    this._discountAmount = discountAmount
    this._cartAmount = cartAmount
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
   *
   * @param {BigCommerceCartLineItemPhysical} item
   */
  addPhysicalItem (item) {
    this.lineItems.physical.push(item)
  }

  /**
   * @returns {BigCommerceCartLineItems}
   */
  get lineItems () {}

  get currency () {
    return this._currency
  }

  get baseAmount () {
    return this._baseAmount
  }

  get discountAmount () {
    return this._discountAmount
  }

  get cartAmount () {
    return this._cartAmount
  }

  get taxIncluded () {
    return this._isTaxIncluded
  }
}

module.exports = BigCommerceCart
