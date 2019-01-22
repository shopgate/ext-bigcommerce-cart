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
      bigCommerceResponse.cart_amount,
      bigCommerceResponse.customer_id || null
    )

    for (const physicalItem of this._getPhysicalItems(bigCommerceResponse.line_items)) {
      const item = this._lineItemFactory.createPhysicalItem(physicalItem)
      for (const option of physicalItem.options || []) {
        item.addOption(option.name_id, option.name, option.value, option.value_id)
      }
      bigCommerceCart.addItem(item)
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
