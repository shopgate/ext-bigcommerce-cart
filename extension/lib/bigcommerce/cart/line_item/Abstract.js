class BigCommerceCartLineItemAbstract {
  /**
   * @param {number} id
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

  get id () {
    return this._id
  }

  get productId () {
    return this._productId
  }

  get variantId () {
    return this._variantId
  }

  get name () {
    return this._name
  }

  get url () {
    return this._url
  }

  get quantity () {
    return this._quantity
  }

  get isTaxable () {
    return this._isTaxable
  }

  get imageUrl () {
    return this._imageUrl
  }

  get listPrice () {
    return this._listPrice
  }

  get salePrice () {
    return this._salePrice
  }

  get discounts () {
    return this._discounts
  }

  get coupons () {
    return this._coupons
  }

  get discountAmount () {
    return this._discountAmount
  }

  get couponAmount () {
    return this._couponAmount
  }
}

module.exports = BigCommerceCartLineItemAbstract
