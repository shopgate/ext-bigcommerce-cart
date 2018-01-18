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
    return new BigCommerceCartLineItemRequest(productId, quantity)
  }

  /**
   * @param {BigCommerceCartLineItemRequest[]} items
   * @returns {Promise<void>}
   */
  async addItems (items) {
    const cartId = await this._storage.get(CART_ID)
    if (!cartId) {
      const bigCommerceResponse = await this._client.post('/carts', {'line_items': items.map(BigCommerceCartRepository._toApiLineItem)})
      await this._storage.set(CART_ID, bigCommerceResponse.data.id)

      return
    }

    await this._client.post('/carts/' + cartId + '/items', {
      'cartId': cartId,
      'line_items': items.map(BigCommerceCartRepository._toApiLineItem)
    })
  }

  /**
   * @param lineItemRequest
   * @private
   */
  static _toApiLineItem (lineItemRequest) {
    const lineItem = {
      product_id: lineItemRequest.productId,
      quantity: lineItemRequest.quantity
    }

    if (lineItemRequest.variantId) {
      lineItem.variant_id = lineItemRequest.variantId
    }

    return lineItem
  }

  /**
   * @return {Promise<?Object>}
   * @private
   */
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

  /**
   * @param {string} cartId
   * @returns {Promise<string>}
   */
  async getCheckoutUrl (cartId) {
    /** @type BigCommerceRedirectUrlsResponse */
    const response = await this._client.get('/carts/' + cartId + '/redirect_urls')

    if (!response.data.hasOwnProperty('redirect_urls')) {
      throw new Error('could not create webcheckout url')
    }

    return response.data.redirect_urls
  }

  async deleteItems () {

  }
}

module.exports = BigCommerceCartRepository
