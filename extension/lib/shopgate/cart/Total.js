class ShopgateCartTotal {
  /**
   * @param {string} type - enum ShopgateCartTotalType
   * @param {string} label
   * @param {number} amount
   * @param {ShopgateCartTotal[]} subTotals
   */
  constructor (type, label, amount, subTotals) {
    this.type = type
    this.label = label
    this.amount = amount
    this.subTotals = subTotals
  }
}

module.exports = ShopgateCartTotal
