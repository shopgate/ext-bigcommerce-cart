const BigCommerceCart = require('./Cart')

class BigCommerceCartFactory {
  /**
   * @param {BigCommerceCartLineItemFactory} lineItemFactory
   */
  constructor (lineItemFactory) {
    this._lineItemFactory = lineItemFactory
  }
  /**
   * @param bigCommerceResponse
   * @returns {BigCommerceCart}
   */
  fromApiResponse (bigCommerceResponse) {
    const bigCommerceCart = new BigCommerceCart({
      id: bigCommerceResponse.id,
      currency: bigCommerceResponse.currency.code,
      isTaxIncluded: bigCommerceResponse.is_tax_included,
      baseAmount: bigCommerceResponse.base_amount,
      discountAmount: bigCommerceResponse.discount_amount,
      cartAmount: bigCommerceResponse.cart_amount
    })
    for (const physicalItem of bigCommerceResponse.line_items.physical_items) {
      bigCommerceCart.addPhysicalItem(this._lineItemFactory.createPhysicalItem(physicalItem))
    }

    // later on add coupons, discounts, etc

    return bigCommerceCart
  }
}

module.exports = BigCommerceCartFactory
