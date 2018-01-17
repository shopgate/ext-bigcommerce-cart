const BigCommerceCart = require('./Cart')

class BigCommerceCartFactory {
  /**
   * @param {BigCommerceCartLineItemFactory} lineItemFactory
   */
  constructor (lineItemFactory) {
    this._lineItemFactory = lineItemFactory
  }
  /**
   * @param {BigCommerceCartResponse} bigCommerceResponse
   * @returns {BigCommerceCart}
   */
  fromApiResponse (bigCommerceResponse) {
    const bigCommerceCart = new BigCommerceCart(
      bigCommerceResponse.id,
      bigCommerceResponse.currency.code,
      bigCommerceResponse.is_tax_included,
      bigCommerceResponse.base_amount,
      bigCommerceResponse.discount_amount,
      bigCommerceResponse.cart_amount
    )
    for (const physicalItem of bigCommerceResponse.line_items.physical_items) {
      bigCommerceCart.addPhysicalItem(this._lineItemFactory.createPhysicalItem(physicalItem))
    }

    // later on add coupons, discounts, etc
    return bigCommerceCart
  }
}

module.exports = BigCommerceCartFactory
