class ShopgateCart {
  /**
   * @param {string} currency
   * @param {ShopgateMessage[]} messages
   * @param {object} text
   * @param {ShopgateCartItem[]} cartItems
   * @param {ShopgateTotal[]} totals
   * @param {ShopgateFlags} flags
   */
  constructor ({isOrderable, isTaxIncluded, currency, messages, text, cartItems, totals, flags}) {
    this.currency = currency
    this.messages = messages
    this.text = text
    this.cartItems = cartItems
    this.totals = totals
    this.flags = flags
  }
}

module.exports = ShopgateCart
