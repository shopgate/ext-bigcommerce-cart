const SUBTOTAL = 'subTotal'
const SHIPPING = 'shipping'
const TAX = 'tax'
const PAYMENT = 'payment'
const DISCOUNT = 'discount'
const GRANDTOTAL = 'grandTotal'

class ShopgateCartTotalType {
  constructor () {
    this._SUBTOTAL = SUBTOTAL
    this._SHIPPING = SHIPPING
    this._TAX = TAX
    this._PAYMENT = PAYMENT
    this._DISCOUNT = DISCOUNT
    this._GRANDTOTAL = GRANDTOTAL
  }

  /**
   * @return {string}
   */
  get SUBTOTAL () {
    return this._SUBTOTAL
  }

  /**
   * @return {string}
   */
  get SHIPPING () {
    return this._SHIPPING
  }

  /**
   * @return {string}
   */
  get TAX () {
    return this._TAX
  }

  /**
   * @return {string}
   */
  get PAYMENT () {
    return this._PAYMENT
  }

  /**
   * @return {string}
   */
  get DISCOUNT () {
    return this._DISCOUNT
  }

  /**
   * @return {string}
   */
  get GRANDTOTAL () {
    return this._GRANDTOTAL
  }
}

module.exports = ShopgateCartTotalType
