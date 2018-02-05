const BigCommerceCartLineItems = require('./cart/LineItems')

class BigCommerceCart {
  /**
   * @param {string} id
   * @param {string} currency
   * @param {boolean} isTaxIncluded
   * @param {number} baseAmount
   * @param {number} discountAmount
   * @param {number} cartAmount
   */
  constructor (id, currency, isTaxIncluded, baseAmount, discountAmount, cartAmount) {
    this._id = id
    this._currency = currency
    this._isTaxIncluded = isTaxIncluded
    this._baseAmount = baseAmount
    this._discountAmount = discountAmount
    this._cartAmount = cartAmount
    this._lineItems = new BigCommerceCartLineItems()
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
   * @param {BigCommerceCartLineItemPhysical} item
   */
  addPhysicalItem (item) {
    this._lineItems.physical.push(item)
  }

  /**
   * @returns {BigCommerceCartLineItems}
   */
  get lineItems () {
    return this._lineItems
  }

  /**
   * @returns {string}
   */
  get currency () {
    return this._currency
  }

  /**
   * @returns {number}
   */
  get baseAmount () {
    return this._baseAmount
  }

  /**
   * @returns {number}
   */
  get discountAmount () {
    return this._discountAmount
  }

  /**
   * @returns {number}
   */
  get cartAmount () {
    return this._cartAmount
  }

  /**
   * @returns {boolean}
   */
  get taxIncluded () {
    return this._isTaxIncluded
  }

  /**
   * @returns {number}
   */
  get productsSubTotal () {
    let subtotal = 0
    for (const lineItem of this._lineItems.physical) {
      subtotal += lineItem.salePrice * lineItem.quantity
    }
    for (const lineItem of this._lineItems.digital) {
      subtotal += lineItem.salePrice * lineItem.quantity
    }

    return subtotal
  }
}

module.exports = BigCommerceCart
