class ShopgateCartFlags {
  /**
   * @param {boolean} [taxIncluded]
   * @param {boolean} [orderable]
   * @param {boolean} [supportsCoupons]
   */
  constructor (taxIncluded = false, orderable = true, supportsCoupons = false) {
    this._taxIncluded = taxIncluded
    this._orderable = orderable
    this._supportsCoupons = supportsCoupons
  }

  /**
   * @return {boolean}
   */
  get taxIncluded () {
    return this._taxIncluded
  }

  /**
   * @return {boolean}
   */
  get orderable () {
    return this._orderable
  }

  /**
   * @return {boolean}
   */
  get supportsCoupons () {
    return this._supportsCoupons
  }
}

module.exports = ShopgateCartFlags
