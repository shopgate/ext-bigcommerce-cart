const CART_ID = 'cartId'
class BigCommerceCartRepository {
  /**
   * @param {BigCommerce} client Api V3 client
   * @param {BigCommerceStorage} storage
   */
  constructor (client, storage) {
    this._client = client
    this._storage = storage
  }

  /**
   * @return {Promise<BigCommerceCart>}
   */
  async load () {
    const cartId = await this._storage.get(CART_ID)
    let cartData = {}
    if (cartId) {
      cartData = this.acquireCart(cartId)
    }
    return cartData
  }

  /**
   * @param {BigCommerceCart} cart
   * @param {BigCommerceCartLineItemRequest[]} items
   * @returns {Promise<void>}
   */
  async addItems (cart, items) {
    // add items to the cart, persist them via client
  }

  async acquireCart (cartId) {
    try {
      return await this._client.get('/carts/' + cartId)
    } catch (error) {
      if (error.code !== 404) {
        throw new Error(error.message, error.code)
      }
      await this._storage.delete(CART_ID)

      return {}
    }
  }
}

module.exports = BigCommerceCartRepository
