class ShopgateCartTotal {
  /**
   * @param {ShopgateCartTotalType.SUBTOTAL|ShopgateCartTotalType.SHIPPING|ShopgateCartTotalType.TAX|ShopgateCartTotalType.PAYMENT|ShopgateCartTotalType.DISCOUNT|ShopgateCartTotalType.GRANDTOTAL} type
   * @param {string} label
   * @param {number} amount
   * @param {ShopgateCartTotal[]} subTotals
   */
  constructor ({type, label, amount, subTotals}) {
    this._type = type
    this._label = label
    this._amount = amount
    this._subTotals = subTotals
  }

  /**
   * @return {ShopgateCartTotalType.SUBTOTAL|ShopgateCartTotalType.SHIPPING|ShopgateCartTotalType.TAX|ShopgateCartTotalType.PAYMENT|ShopgateCartTotalType.DISCOUNT|ShopgateCartTotalType.GRANDTOTAL}
   */
  get type () {
    return this._type
  }

  /**
   * @return {string}
   */
  get label () {
    return this._label
  }

  /**
   * @return {number}
   */
  get amount () {
    return this._amount
  }

  /**
   * @return {ShopgateCartTotal[]}
   */
  get subTotals () {
    return this._subTotals
  }
}

module.exports = ShopgateCartTotal
