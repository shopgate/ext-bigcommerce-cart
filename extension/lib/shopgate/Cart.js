// aggregate root, not an entity as it has no identity
// we still might go with value object and make this class immutable - this would require us to expose ShopgateCartTotal as a type
class ShopgateCart {
  /**
   * @param {boolean} isOrderable
   * @param {boolean} isTaxIncluded
   * @param {string} currency
   * @param {ShopgateCartMessage[]} messages
   * @param {object} text
   * @param {ShopgateCartItem[]} cartItems
   * @param {ShopgateTotal[]} totals
   * @param {ShopgateCartFlags} flags
   */
  constructor ({isOrderable, isTaxIncluded, currency, messages, text, cartItems, totals, flags}) {
    this._isOrderable = isOrderable
    this._isTaxIncluded = isTaxIncluded
    this._currency = currency
    this._messages = messages
    this._text = text
    this._cartItems = cartItems
    this._totals = totals
    this._flags = flags
  }
  addTotal (type, label, amount) {}
  get flags () {}
  get totals () {}
  get currency () {}

  /**
   * @returns {ShopgateCartItem[]}
   */
  get items () {}
  get messages () {}
}

module.exports = ShopgateCart
