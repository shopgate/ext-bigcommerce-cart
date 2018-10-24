const ShopgateCartTotal = require('./cart/Total')
const ShopgateCartItemBuilder = require('./cart/ItemBuilder')
const ShopgateCartFlags = require('./cart/Flags')

class ShopgateCart {
  /**
   * @param {string} [currency='']
   * @param {boolean} [isOrderable=true]
   * @param {boolean} [isTaxIncluded=false]
   */
  constructor (currency = '', isOrderable = true, isTaxIncluded = false) {
    this.currency = currency
    this.messages = []
    this.text = []
    this.cartItems = []
    this.totals = []
    this.flags = new ShopgateCartFlags(isTaxIncluded, isOrderable, false)
  }

  /**
   * @param {string} type
   * @param {string} label
   * @param {number} amount
   */
  addTotal (type, label, amount) {
    this.totals.push(new ShopgateCartTotal(type, label, amount, []))
  }

  /**
   * @param {ShopgateCartItem} item
   */
  addItem (item) {
    this.cartItems.push(item)
  }

  /**
   * @param {string} id
   * @param {number} quantity
   * @returns {ShopgateCartItemBuilder}
   */
  createItemBuilder (id, quantity) {
    return new ShopgateCartItemBuilder(id, quantity)
  }
}

module.exports = ShopgateCart
