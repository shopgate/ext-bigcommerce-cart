const BigcommerceLineItem = require('./entity/BigcommerceLineItem')
class BigcommerceUpdateObjectsBuilder {
  /**
   * @param {ShopgateCart} cart
   * @param {object[]} smallCartItems
   */
  constructor(cart, smallCartItems) {
    this._cart = cart
    this._smallCartItems = smallCartItems
  }

  /**
   * @return {object[]}
   */
  build () {
    const bigcommerceProductUpdates = []
    for (const smallCartItem of this._smallCartItems) {
      let cartItem = this._getCartProductByCartItemId(smallCartItem.CartItemId)
      if (cartItem.product && cartItem.product.id) {
        bigcommerceProductUpdates.push({cartItemId: smallCartItem.CartItemId, lineItem : this._getBigCommerceUpdateLineItem(cartItem, smallCartItem)})
      }
    }
    return bigcommerceProductUpdates
  }

  /**
   * @param {string} cartItemId
   * @return {ShopgateCartProduct|object}
   * @private
   */
  _getCartProductByCartItemId(cartItemId) {
    for (const cartItem of this._cart.cartItems) {
      if (cartItem.id === cartItemId) {
        return cartItem
      }
    }

    return {}
  }

  _getBigCommerceUpdateLineItem (cartItem, smallCartItem) {
    return new BigcommerceLineItem({productId: cartItem.product.id, quantity: smallCartItem.quantity})
  }
}

module.exports = BigcommerceUpdateObjectsBuilder
