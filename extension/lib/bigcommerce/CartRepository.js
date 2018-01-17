const BigCommerceCartFactory = require('./CartFactory')
const BigCommerceCartLineItemFactory = require('./cart/LineItemFactory')
const BigCommerceCartLineItemRequest = require('./cart/LineItemRequest')

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
  static createLineItem (quantity, productId) {
    const bigCommerceCartLineItemRequest = new BigCommerceCartLineItemRequest(productId, quantity)

    return bigCommerceCartLineItemRequest.toReadModel()
  }

  /**
   * @param {BigCommerceCartLineItemRequest[]} items
   * @returns {Promise<void>}
   */
  async addItems (items) {
    const cartId = await this._storage.get(CART_ID)
    if (!cartId) {
      return this._createCartAndAddProducts(items)
    }
    try {
      return await this._client.post('/carts/' + cartId + '/items', {
        'cartId': cartId,
        'line_items': items
      })
    } catch (error) {
      if (error.code !== 500) {
        throw new Error(error.message)
      }
      return this._createCartAndAddProducts(items)
    }
  }

  /**
   *@param {BigCommerceCartLineItemRequest[]} items
   * @return {Promise.<void>}
   * @private
   */
  async _createCartAndAddProducts (items) {
    const bigCommerceResponse = await this._client.post('/carts', {'line_items': items})
    await this._storage.set(CART_ID, bigCommerceResponse.data.id)
  }

  async _acquireCart () {
    const cartId = await this._storage.get(CART_ID)

    if (!cartId) {
      return null
    }

    try {
      const response = await this._client.get('/carts/' + cartId)

      return response.data
    } catch (error) {
      if (error.code !== 404) {
        throw error
      }
      await this._storage.delete(CART_ID)
      return null
    }
  }
}

module.exports = BigCommerceCartRepository
