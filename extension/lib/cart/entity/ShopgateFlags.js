class ShopgateFlags {
  /**
   * @param {boolean} taxIncluded
   * @param {boolean} orderable
   * @param {boolean} coupons
   */
  constructor ({taxIncluded, orderable, coupons}) {
    this.taxIncluded = taxIncluded
    this.orderable = orderable
    this.coupons = coupons
  }
}

module.exports = ShopgateFlags
