const ShopgateCartTotal = require('./cart/Total')
const ShopgateCartItemBuilder = require('./cart/ItemBuilder')
const ShopgateCartFlags = require('./cart/Flags')

class ShopgateCart {
  /**
   * @param {string} currency
   * @param {boolean} [isOrderable=true]
   * @param {boolean} [isTaxIncluded=false]
   */
  constructor (currency, isOrderable = true, isTaxIncluded = false) {
    this._currency = currency
    this._messages = []
    this._text = []
    this._cartItems = []
    this._totals = []
    this._flags = new ShopgateCartFlags(isTaxIncluded, isOrderable, false)
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
    this._cartItems.push(item)
  }

  /**
   * @param {string} id
   * @param {number} quantity
   * @returns {ShopgateCartItemBuilder}
   */
  createItembuilder (id, quantity) {
    return new ShopgateCartItemBuilder(id, quantity)
  }

  /**
   * @return {ShopgateCartFlags}
   */
  get flags () {
    return this._flags
  }

  /**
   * @return {ShopgateCartTotal[]}
   */
  get totals () {
    return this._totals
  }

  /**
   * @return {string}
   */
  get currency () {
    return this._currency
  }

  /**
   * @returns {ShopgateCartItem[]}
   */
  get items () {
    return this._cartItems
  }

  /**
   * @return {ShopgateCartMessage[]}
   */
  get messages () {
    return this._messages
  }

  /**
   * @return {ShopgateCartText[]}
   */
  get text () {
    return this._text
  }
}

module.exports = ShopgateCart
