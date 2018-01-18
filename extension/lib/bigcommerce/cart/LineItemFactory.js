const BigCommerceCartLineItemPhysical = require('./line_item/Physical')

class BigCommerceCartLineItemFactory {
  /**
   * @param {BigCommerceApiCartLineItemPhysical} bigCommerceItem
   *
   * @return {BigCommerceCartLineItemPhysical}
   */
  createPhysicalItem (bigCommerceItem) {
    return new BigCommerceCartLineItemPhysical(
      bigCommerceItem.id,
      bigCommerceItem.product_id,
      bigCommerceItem.variant_id,
      bigCommerceItem.name,
      bigCommerceItem.url,
      bigCommerceItem.quantity,
      bigCommerceItem.taxable,
      bigCommerceItem.image_url,
      bigCommerceItem.list_price,
      bigCommerceItem.sale_price,
      bigCommerceItem.is_require_shipping,
      bigCommerceItem.gift_wrapping
    )
  }
}

module.exports = BigCommerceCartLineItemFactory
