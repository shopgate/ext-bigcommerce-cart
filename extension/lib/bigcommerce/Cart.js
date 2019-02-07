const BigCommerceCartLineItems = require('./cart/LineItems')

class BigCommerceCart {
  /**
   * @param {string} id
   * @param {string} currency
   * @param {boolean} isTaxIncluded
   * @param {number} baseAmount
   * @param {number} discountAmount
   * @param {number} cartAmount
   * @param {number|null} [customerId=null]
   */
  constructor (id, currency, isTaxIncluded, baseAmount, discountAmount, cartAmount, customerId = null) {
    this._id = id
    this._currency = currency
    this._isTaxIncluded = isTaxIncluded
    this._baseAmount = baseAmount
    this._discountAmount = discountAmount
    this._cartAmount = cartAmount
    this._lineItems = new BigCommerceCartLineItems()
    this._customerId = customerId
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
   * @return {number|null}
   */
  get customerId () {
    return this._customerId
  }

  /**
   * @param {BigCommerceCartLineItemAbstract} item
   */
  addItem (item) {
    this._lineItems.add(item)
  }

  /**
   * @param {string} itemId
   * @return {BigCommerceCartLineItemAbstract|null}
   */
  findItem (itemId) {
    return this.lineItems.find(itemId)
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
