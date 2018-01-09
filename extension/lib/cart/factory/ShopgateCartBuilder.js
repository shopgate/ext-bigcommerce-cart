const ShopgateCart = require('../entity/ShopgateCart')
const ShopgateCartItemsBuilder = require('./ShopgateCartItemsBuilder')
const ShopgateFlags = require('../entity/ShopgateFlags')
const ShopgateTotal = require('../entity/ShopgateTotal')

class ShopgateCartBuilder {
  /**
   * @param {object} bigcommerceCartResponse
   */
  constructor (bigcommerceCartResponse) {
    this._bigcommerceCartResponse = bigcommerceCartResponse
  }

  /**
   * @returns {ShopgateCart}
   */
  build () {
    return new ShopgateCart({
      isOrderable: this.getIsOrderable(),
      isTaxIncluded: this.getIsTaxIncluded(),
      currency: this._getCurrency(),
      messages: this._getMessages(),
      text: this._getText(),
      cartItems: this._getCartItems(),
      totals: this._getTotals(),
      flags: this._getFlags()
    })
  }

  getIsOrderable () {
    return true
  }

  getIsTaxIncluded () {
    return this._bigcommerceCartResponse.data.tax_included
  }

  _getMessages () {
    return []
  }

  /**
   * @return {array}
   * @private
   */
  _getCartItems () {
    const shopgateCartItemsBuilder = new ShopgateCartItemsBuilder(this._bigcommerceCartResponse)
    return shopgateCartItemsBuilder.build()
  }

  /**
   * @return {string}
   * @private
   */
  _getCurrency () {
    return this._bigcommerceCartResponse.data.currency.code
  }

  /**
   *
   * @return {ShopgateTotal[]}
   * @private
   */
  _getTotals () {
    let totals = []
    let baseAmount = this._bigcommerceCartResponse.data.base_amount
    let discountAmount = this._bigcommerceCartResponse.data.discount_amount
    let cartAmount = this._bigcommerceCartResponse.data.cart_amount
    if (discountAmount > 0) {
      totals.push(new ShopgateTotal({
        type: 'subTotal',
        label: 'Subtotal',
        amount: baseAmount
      }))
      totals.push(new ShopgateTotal({
        type: 'discount',
        label: 'Discount',
        amount: discountAmount
      }))
      totals.push(new ShopgateTotal({
        type: 'grandTotal',
        label: 'Total',
        amount: cartAmount
      }))
    } else {
      totals.push(new ShopgateTotal({
        type: 'subTotal',
        label: 'Subtotal',
        amount: cartAmount
      }))
    }
    return totals
  }

  _getText () {
    return {}
  }

  /**
   *
   * @return {ShopgateFlags}
   * @private
   */
  _getFlags () {
    return new ShopgateFlags({
      taxIncluded: this._bigcommerceCartResponse.data.tax_included,
      orderable: true,
      coupons: true
    })
  }
}
module.exports = ShopgateCartBuilder
