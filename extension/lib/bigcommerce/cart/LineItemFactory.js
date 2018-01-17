const BigCommerceCartLineItemPhysical = require('./line_item/Physical')

class BigCommerceCartLineItemFactory {
  /**
   * @return {BigCommerceCartLineItemPhysical}
   */
  createPhysicalItem (bigCommerceItem) {
    return new BigCommerceCartLineItemPhysical({
      id: bigCommerceItem.id,
      productId: bigCommerceItem.product_id,
      variantId: bigCommerceItem.variant_id,
      name: bigCommerceItem.name,
      url: bigCommerceItem.url,
      quantity: bigCommerceItem.quantity,
      isTaxable: bigCommerceItem.taxable,
      imageUrl: bigCommerceItem.image_url,
      listPrice: bigCommerceItem.list_price,
      salePrice: bigCommerceItem.sale_price,
      isRequireShipping: bigCommerceItem.is_require_shipping,
      giftWrapping: bigCommerceItem.gift_wrapping
    })
  }
}

module.exports = BigCommerceCartLineItemFactory
