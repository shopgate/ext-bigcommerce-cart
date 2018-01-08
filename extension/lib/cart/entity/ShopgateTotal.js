class ShopgateTotal {
  /**
   * @param {'subTotal'|'shipping'|'tax'|'payment'|'discount'|'grandTotal'} type
   * @param {string} label
   * @param {number} amount
   * @param {ShopgateTotal[]} subTotals
   */
  constructor ({type, label, amount, subTotals}) {
      this.type = type
      this.label = label
      this.amount = amount
      this.subTotals = subTotals
  }
}

module.exports = ShopgateTotal
