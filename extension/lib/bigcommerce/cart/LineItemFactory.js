const BigCommerceCartLineItemPhysical = require('./line_item/Physical')

class BigCommerceCartLineItemFactory {
  /**
   * @return {BigCommerceCartLineItemPhysical}
   */
  createPhysicalItem (bigCommerceItem) {
    const item = new BigCommerceCartLineItemPhysical({
      id: bigCommerceItem.id,
      productId: bigCommerceItem.product_id,
      variantId: bigCommerceItem.variant_id
    })

    // item.addCoupon()
    // item.addDiscount()

    return item
  }
}

module.exports = BigCommerceCartLineItemFactory
