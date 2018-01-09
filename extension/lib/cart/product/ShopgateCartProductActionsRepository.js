const BigCommerceLineItemsBuilder = require('./BigCommerceLineItemsBuilder')

class ShopgateCartProductActionsRepository {
  /**
   * @param {BigCommerce} apiVersion3Client
   */
  constructor (apiVersion3Client) {
    this._apiVersion3Client = apiVersion3Client
  }

  /**
   * @param {string} cartId
   * @param {ShopgateProduct[]} products
   * @return {Promise.<object>}
   */
  async addToCart (cartId, products) {
    const bigCommerceLineItemsBuilder = new BigCommerceLineItemsBuilder(products)
    return this._apiVersion3Client.post('/carts/' + cartId + '/items', {
      'cartId': cartId,
      'line_items': bigCommerceLineItemsBuilder.build()
    })
  }

  /**
   * @param {ShopgateProduct[]} products
   * @return {Promise.<{cartId, response: *}>}
   */
  async createCartAndAddProducts (products) {
    const bigCommerceLineItemsBuilder = new BigCommerceLineItemsBuilder(products)
    const bigcommerceCartAddProductResponse = await this._apiVersion3Client.post('/carts/', {'line_items': bigCommerceLineItemsBuilder.build()})

    return {cartId: bigcommerceCartAddProductResponse.data.id, 'response': bigcommerceCartAddProductResponse}
  }
}

module.exports = ShopgateCartProductActionsRepository
