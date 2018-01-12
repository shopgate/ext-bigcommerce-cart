const BigCommerceCartFactory = require('./CartFactory')
const BigCommerceCartLineItemFactory = require('./cart/LineItemFactory')

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
   * @return {Promise<?BigCommerceCart>}
   */
  async load () {
    const cartResponse = await this._acquireCart()
    if (!cartResponse) {
      return null
    }

    return BigCommerceCartRepository._createFactory().fromApiResponse(cartResponse)
  }

  /**
   * @returns {BigCommerceCartFactory}
   * @private
   */
  static _createFactory () {
    return new BigCommerceCartFactory(new BigCommerceCartLineItemFactory())
  }

  /**
   * Creates new line item.
   *
   * @param {number} quantity
   * @param {number} productId
   * @returns {BigCommerceCartLineItemRequest}
   */
  static createLineItem (quantity, productId) {}

  /**
   * @param {BigCommerceCart} cart
   * @param {BigCommerceCartLineItemRequest[]} items
   * @returns {Promise<void>}
   */
  async addItems (cart, items) {
    // add items to the cart, persist them via client
  }

  async _acquireCart () {
    const cartId = await this._storage.get(CART_ID)
    if (!cartId) {
      return null
    }

    let cartResponse = null
    try {
      const response = await this._client.get('/carts/' + cartId)
      cartResponse = response.data
    } catch (error) {
      if (error.code !== 404) {
        throw error
      }
    }

    return cartResponse
  }
}

module.exports = BigCommerceCartRepository
