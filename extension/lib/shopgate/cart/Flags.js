class ShopgateCartFlags {
  /**
   * @param {boolean} [taxIncluded=false]
   * @param {boolean} [orderable=true]
   * @param {boolean} [supportsCoupons=false]
   */
  constructor (taxIncluded = false, orderable = true, supportsCoupons = false) {
    this.taxIncluded = taxIncluded
    this.orderable = orderable
    this.coupons = supportsCoupons
  }
}

module.exports = ShopgateCartFlags
