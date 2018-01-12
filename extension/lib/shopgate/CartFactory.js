const ShopgateCart = require('./Cart')
const ShopgateCartFlags = require('./cart/Flags')

// factory, maybe builder name would still apply
class ShopgateCartFactory {
  /**
   * @param {?BigCommerceCart} bigCommerceCart
   * @return {ShopgateCart}
   */
  createFromBigCommerce (bigCommerceCart) {
    if (bigCommerceCart === null) {
      return new ShopgateCart({})
    }

    const cart = new ShopgateCart({
      isOrderable: true,
      isTaxIncluded: bigCommerceCart.tax_included,
      currency: bigCommerceCart.currency.code,
      messages: [],
      cartItems: [],
      flags: new ShopgateCartFlags({
        taxIncluded: bigCommerceCart.taxIncluded,
        orderable: true,
        coupons: true
      })
    })

    cart.addTotal('subTotal', 'SubTotal', bigCommerceCart.baseAmount)
    cart.addTotal('discount', 'Discount', bigCommerceCart.discountAmount)
    cart.addTotal('grandTotal', 'Total', bigCommerceCart.cartAmount)
    cart.addTotal('subTotal', 'SubTotal', bigCommerceCart.cartAmount)

    for (const lineItem of bigCommerceCart.lineItems.physical) {
      const listPrice = lineItem.listPrice
      const salePrice = (lineItem.salePrice < listPrice) ? lineItem.salePrice : null

      const cartItem = cart.items.builder(lineItem.id, lineItem.quantity)
        .withProductId(lineItem.productId)
        .withProductName(lineItem.name)
        .withProductPrice(listPrice, listPrice * lineItem.quantity, salePrice)
        // TODO add everything else
        .build()

      cart.addItem(cartItem)
    }

    return cart
  }
}

module.exports = ShopgateCartFactory
