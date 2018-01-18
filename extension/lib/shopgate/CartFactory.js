const ShopgateCart = require('./Cart')
const ShopgateCartFlags = require('./cart/Flags')

// factory, maybe builder name would still apply
class ShopgateCartFactory {
  /**
   * @param {BigCommerceCart|null} bigCommerceCart
   * @return {ShopgateCart}
   */
  createFromBigCommerce (bigCommerceCart) {
    if (bigCommerceCart === null) {
      return new ShopgateCart()
    }

    const cart = new ShopgateCart(
      new ShopgateCartFlags(
        (bigCommerceCart.taxIncluded) ? bigCommerceCart.taxIncluded : false,
        true,
        false
      ),
      bigCommerceCart.currency,
      true,
       (bigCommerceCart.taxIncluded) ? bigCommerceCart.taxIncluded : false,
      [],
      []
    )

    cart.addTotal('subTotal', 'SubTotal', bigCommerceCart.baseAmount)
    cart.addTotal('discount', 'Discount', bigCommerceCart.discountAmount)
    cart.addTotal('grandTotal', 'Total', bigCommerceCart.cartAmount)
    cart.addTotal('subTotal', 'SubTotal', bigCommerceCart.cartAmount)

    for (const lineItem of bigCommerceCart.lineItems.physical) {
      const listPrice = lineItem.listPrice !== 0 ? lineItem.listPrice : lineItem.salePrice
      const salePrice = (lineItem.listPrice !== 0 && lineItem.listPrice !== lineItem.salePrice) ? lineItem.salePrice : null

      const cartItem = cart.createItembuilder(lineItem.id, lineItem.quantity)
        .withProductId(lineItem.productId)
        .withProductName(lineItem.name)
        .withProductPrice(listPrice, listPrice * lineItem.quantity, salePrice)
        .withFeaturedImageUrl(lineItem.imageUrl)
        .withAddtionalInfo()
        .withProperties()
        .withAppliedDiscounts()
        .build()

      cart.addItem(cartItem)
    }
    return cart
  }
}

module.exports = ShopgateCartFactory
