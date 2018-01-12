const ShopgateCartTotal = require('./cart/Total')
const ShopgateCartItemBuilder = require('./cart/ItemBuilder')

class ShopgateCart {
  /**
   * @param {boolean} isOrderable
   * @param {boolean} isTaxIncluded
   * @param {string} currency
   * @param {ShopgateCartMessage[]} messages
   * @param {object} text
   * @param {ShopgateCartFlags} flags
   */
  constructor ({isOrderable, isTaxIncluded, currency, messages, text, flags}) {
    this._isOrderable = isOrderable
    this._isTaxIncluded = isTaxIncluded
    this._currency = currency
    this._messages = messages
    this._text = text
    this._cartItems = []
    this._totals = []
    this._flags = flags
  }

  /**
   * @param {string} type
   * @param {string} label
   * @param {number} amount
   */
  addTotal (type, label, amount) {
    this._totals.push(new ShopgateCartTotal(type, label, amount, []))
  }

  /**
   * @param {ShopgateCartItem} item
   */
  addItem (item) {
    this._cartItems.add(item)
  }

  /**
   *
   * @param id
   * @param quantity
   * @returns {ShopgateCartItemBuilder}
   */
  createItembuilder (id, quantity) {
    return new ShopgateCartItemBuilder(id, quantity)
  }

  get flags () {}
  get totals () {}
  get currency () {}

  /**
   * @returns {ShopgateCartItems}
   */
  get items () {
    return this._cartItems
  }

  get messages () {}
}

module.exports = ShopgateCart
