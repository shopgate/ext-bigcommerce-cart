const BigCommerceCart = require('./Cart')

class BigCommerceCartFactory {
  /**
   * @param {BigCommerceCartLineItemFactory} lineItemFactory
   */
  constructor (lineItemFactory) {
    this._lineItemFactory = lineItemFactory
  }

  /**
   * @param {BigCommerceApiCartResponse} bigCommerceResponse
   * @returns {BigCommerceCart}
   */
  fromApiResponse (bigCommerceResponse) {
    const bigCommerceCart = new BigCommerceCart(
      bigCommerceResponse.id,
      bigCommerceResponse.currency.code,
      bigCommerceResponse.tax_included,
      bigCommerceResponse.base_amount,
      bigCommerceResponse.discount_amount,
      bigCommerceResponse.cart_amount
    )

    for (const physicalItem of this._getPhysicalItems(bigCommerceResponse.line_items)) {
      bigCommerceCart.addItem(this._lineItemFactory.createPhysicalItem(physicalItem))
    }

    // later on add coupons, discounts, etc
    return bigCommerceCart
  }

  /**
   * @param {BigCommerceApiCartLineItems} lineItems
   * @return {BigCommerceApiCartLineItemPhysical[]}
   * @private
   */
  _getPhysicalItems (lineItems) {
    if (!lineItems || !lineItems.physical_items) {
      return []
    }

    return lineItems.physical_items
  }
}

module.exports = BigCommerceCartFactory
