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
   * @return {Promise<BigCommerceCart|null>}
   */
  async load () {
    const cartResponse = await this._acquireCart()

    if (!cartResponse) {
      return null
    }

    return BigCommerceCartRepository._createFactory().fromApiResponse(cartResponse)
  }

  async destroy () {
    const cartId = await this._storage.get(CART_ID)
    if (!cartId) {
      return
    }

    await this._client.delete('/carts/' + cartId)
    await this._storage.delete(CART_ID)
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
   * @param {number} productId
   * @param {number} quantity
   * @returns {BigCommerceCartLineItemRequest}
   */
  static createLineItem (productId, quantity) {
    return new BigCommerceCartLineItemRequest(productId, quantity)
  }

  /**
   * @param {BigCommerceCartLineItemRequest[]} items
   * @returns {Promise<void>}
   */
  async addItems (items) {
    const cartId = await this._storage.get(CART_ID)

    if (!cartId) {
      const bigCommerceResponse = await this._client.post('/carts', {'line_items': items.map(this._toApiLineItem)})
      await this._storage.set(CART_ID, bigCommerceResponse.data.id)

      return
    }

    await this._client.post('/carts/' + cartId + '/items', {
      'cartId': cartId,
      'line_items': items.map(this._toApiLineItem)
    })
  }

  /**
   * @param {BigCommerceCartLineItemRequest} lineItemRequest
   * @private
   */
  _toApiLineItem (lineItemRequest) {
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
   * @return {Promise<BigCommerceApiCartResponse|null>}
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
   * @returns {Promise<string>}
   */
  async getCheckoutUrl () {
    const cartId = await this._storage.get(CART_ID)

    if (!cartId) {
      throw new Error('no cart found')
    }

    /** @type BigCommerceRedirectUrlsResponse */
    const response = await this._client.post('/carts/' + cartId + '/redirect_urls')

    if (!response.data || !response.data.hasOwnProperty('checkout_url')) {
      throw new Error('could not create webcheckout url')
    }

    return response.data.checkout_url
  }

  /**
   * @param {[string]} cartItemIds
   * @return {Promise.<void>}
   */
  async deleteProductFromCart (cartItemIds) {
    const cartId = await this._storage.get(CART_ID)
    if (!cartId) {
      throw (new Error('Cart ID is not available'))
    }
    const deletePromises = []
    for (let cartItemId of cartItemIds) {
      deletePromises.push(this._client.delete('/carts/' + cartId + '/items/' + cartItemId))
    }

    await Promise.all(deletePromises)
  }
}

module.exports = BigCommerceCartRepository
