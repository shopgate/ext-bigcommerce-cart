const ShopgateCartBuilder = require('./ShopgateCartBuilder')

class ShopgateCartRepository {
  /**
   * @param {BigCommerce} apiVersion3Client
   */
  constructor (apiVersion3Client) {
    this._apiVersion3Client = apiVersion3Client
  }

  /**
   * @param {string} cartId
   * @return {Promise<ShopgateCart>}
   */
  async get (cartId) {
    const bigCommerceCartResponse = await this._apiVersion3Client.get(
      '/carts/' + cartId)
    const shopgateCartBuilder = new ShopgateCartBuilder(bigCommerceCartResponse)
    return shopgateCartBuilder.build()
  }

  /**
   * @param {string} cartId
   * @return {Promise<{string,ShopgateCart}>}
   */
  async createAndGet () {
    const bigCommerceCartResponse = await this._apiVersion3Client.post('/carts', {"cartData": true, "line_items": []})
    const shopgateCartBuilder = new ShopgateCartBuilder(bigCommerceCartResponse)
    return {id: bigCommerceCartResponse.data.id, cart: shopgateCartBuilder.build()}
  }
}

module.exports = ShopgateCartRepository
