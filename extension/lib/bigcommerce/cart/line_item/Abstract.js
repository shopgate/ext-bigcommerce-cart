class BigCommerceCartLineItemAbstract {
  /**
   * @param {string} id
   * @param {number} productId
   * @param {number} variantId
   * @param {string} name
   * @param {string} url
   * @param {number} quantity
   * @param {boolean} isTaxable
   * @param {string} imageUrl
   * @param {number} listPrice
   * @param {number} salePrice
   */
  constructor (id, productId, variantId, name, url, quantity, isTaxable, imageUrl, listPrice, salePrice) {
    this._id = id
    this._productId = productId
    this._variantId = variantId
    this._name = name
    this._url = url
    this._quantity = quantity
    this._isTaxable = isTaxable
    this._imageUrl = imageUrl
    this._discounts = []
    this._coupons = []
    this._discountAmount = 0
    this._couponAmount = 0
    this._listPrice = listPrice
    this._salePrice = salePrice
  }

  addDiscount () {}
  addCoupon () {}

  /**
   * @return {string}
   */
  get id () {
    return this._id
  }

  /**
   * @return {number}
   */
  get productId () {
    return this._productId
  }

  /**
   *@return {number}
   */
  get variantId () {
    return this._variantId
  }

  /**
   * @return {string}
   */
  get name () {
    return this._name
  }

  /**
   * @return {string}
   */
  get url () {
    return this._url
  }

  /**
   *  @return {number}
   */
  get quantity () {
    return this._quantity
  }

  /**
   * @return {boolean}
   */
  get isTaxable () {
    return this._isTaxable
  }

  /**
   * @return {string}
   */
  get imageUrl () {
    return this._imageUrl
  }

  /**
   * @return {number}
   */
  get listPrice () {
    return this._listPrice
  }

  /**
   * @return {number}
   */
  get salePrice () {
    return this._salePrice
  }

  /**
   * @return {BigCommerceApiCartAppliedDiscount[]}
   */
  get discounts () {
    return this._discounts
  }

  /**
   * @return {BigCommerceApiCartAppliedCoupon[]}
   */
  get coupons () {
    return this._coupons
  }

  /**
   * @return {number}
   */
  get discountAmount () {
    return this._discountAmount
  }

  /**
   * @return {number}
   */
  get couponAmount () {
    return this._couponAmount
  }
}

module.exports = BigCommerceCartLineItemAbstract
