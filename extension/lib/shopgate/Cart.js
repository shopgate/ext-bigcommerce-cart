const ShopgateCartTotal = require('./cart/Total')
const ShopgateCartItemBuilder = require('./cart/ItemBuilder')
const ShopgateCartFlags = require('./cart/Flags')

class ShopgateCart {
  /**
   * @param {ShopgateCartFlags} flags
   * @param {string} currency
   * @param {boolean} isOrderable
   * @param {boolean} isTaxIncluded
   * @param {ShopgateCartMessage[]} messages
   * @param {object} text
   */
  constructor (flags = new ShopgateCartFlags(), currency = '', isOrderable = false, isTaxIncluded = false, messages = [], text = []) {
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
    this._cartItems.push(item)
  }

  /**
   * @param id
   * @param quantity
   * @returns {ShopgateCartItemBuilder}
   */
  createItembuilder (id, quantity) {
    return new ShopgateCartItemBuilder(id, quantity)
  }

  /**
   * @return {boolean}
   */
  get isOrderable () {
    return this._isOrderable
  }

  /**
   * @return {boolean}
   */
  get isTaxIncluded () {
    return this._isTaxIncluded
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
