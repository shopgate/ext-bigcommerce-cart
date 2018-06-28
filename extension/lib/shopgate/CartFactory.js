const ShopgateCart = require('./Cart')

const CART_LEVEL_MESSAGES = 'cartMessages'

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

      const cartItem = cart.createItemBuilder(lineItem.id, lineItem.quantity)
        .withProductId(lineItem.productId)
        .withProductName(lineItem.name)
        .withProductPrice(listPrice, listPrice * lineItem.quantity, salePrice * lineItem.quantity)
        .withFeaturedImageUrl(lineItem.imageUrl)
        .withAdditionalInfo()
        .withProperties()
        .withAppliedDiscounts()
        .build()

      cart.addItem(cartItem)
    }

    cart.addTotal('subTotal', 'SubTotal', bigCommerceCart.productsSubTotal)

    return cart
  }


}

/**
 * @param {string} cartId
 * @return {string}
 */
function getCartMessagesKey (cartId) {
  return `${CART_LEVEL_MESSAGES}_${cartId}`
}

module.exports = ShopgateCartFactory
