class ShopgateCartFlags {
  /**
   * @param {boolean} [taxIncluded]
   * @param {boolean} [orderable]
   * @param {boolean} [coupons]
   */
  constructor (taxIncluded = false, orderable = true, coupons = false) {
    this._taxIncluded = taxIncluded
    this._orderable = orderable
    this._coupons = coupons
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
  get coupons () {
    return this._coupons
  }
}

module.exports = ShopgateCartFlags
