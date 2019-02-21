const ShopgateCart = require('./Cart')

class ShopgateCartFactory {
  /**
   * @param {BigCommerceCart|null} bigCommerceCart
   * @return {ShopgateCart}
   */
  createFromBigCommerce (bigCommerceCart) {
    if (bigCommerceCart === null) {
      return new ShopgateCart('', false)
    }

    const cart = new ShopgateCart(
      bigCommerceCart.currency,
      true,
      (bigCommerceCart.taxIncluded) ? bigCommerceCart.taxIncluded : false
    )

    cart.addTotal('discount', 'Discount', bigCommerceCart.discountAmount)
    cart.addTotal('grandTotal', 'Total', bigCommerceCart.cartAmount)

    for (const lineItem of bigCommerceCart.lineItems.physical) {
      const listPrice = lineItem.listPrice !== 0 ? lineItem.listPrice : lineItem.salePrice
      const salePrice = (lineItem.listPrice !== 0 && lineItem.listPrice !== lineItem.salePrice) ? lineItem.salePrice : null

      const defaultPrice = listPrice * lineItem.quantity
      const special = salePrice === null ? null : salePrice * lineItem.quantity

      const cartItemBuilder = cart.createItemBuilder(lineItem.id, lineItem.quantity)
        .withProductId(lineItem.productId)
        .withVariantId(lineItem.variantId)
        .withProductName(lineItem.name)
        .withProductPrice(listPrice, defaultPrice, special)
        .withFeaturedImageUrl(lineItem.imageUrl)
        .withAppliedDiscounts()

      if (lineItem.sku) {
        cartItemBuilder.withProperty('SKU', lineItem.sku)
      }

      for (const option of lineItem.options) {
        cartItemBuilder.withProperty(option.name, option.value)
      }

      cart.addItem(cartItemBuilder.build())
    }

    cart.addTotal('subTotal', 'SubTotal', bigCommerceCart.productsSubTotal)

    return cart
  }
}

module.exports = ShopgateCartFactory
