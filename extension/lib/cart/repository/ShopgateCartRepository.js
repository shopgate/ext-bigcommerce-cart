const ShopgateCartBuilder = require('../factory/ShopgateCartBuilder')
const ShopgateCartActionsRepository = require('../product/repository/ShopgateCartProductActionsRepository')
const CART_ID = 'cartId'

class ShopgateCartRepository {
  /**
   * @param {BigCommerce} apiVersion3Client
   * @param {ShopgateStorage} shopgateStorage
   */
  constructor (apiVersion3Client, shopgateStorage, context) {
    this._apiVersion3Client = apiVersion3Client
    this._shopgateStorage = shopgateStorage
    this._context = context
  }

  /**
   * @param {string} cartId
   * @return {Promise<ShopgateCart>}
   */
  async get () {
    const cartId = await this._shopgateStorage.get(CART_ID)
    if (!cartId) {
      this._context.log.debug('No cart ID found')
      let shopgateCartBuilder = new ShopgateCartBuilder({})
      return shopgateCartBuilder.build()
    }
    try {
      const bigCommerceCartResponse = await this._apiVersion3Client.get(
        '/carts/' + cartId)
      let shopgateCartBuilder = new ShopgateCartBuilder(bigCommerceCartResponse)
      return shopgateCartBuilder.build()
    } catch (error) {
      if (error.code === 404) {
        this._context.log.debug('There was a 404 error when getting cart ||' + JSON.stringify(error))
        await this._shopgateStorage.delete(CART_ID)
        let shopgateCartBuilder = new ShopgateCartBuilder({})
        return shopgateCartBuilder.build()
      }
      throw new Error(error.message, error.code)
    }
  }

  async addProducts (products) {
    this._context.log.debug('Doing add products from cart repository')
    const cartId = await this._shopgateStorage.get(CART_ID)
    const shopgateCartProductActionsRepository = new ShopgateCartActionsRepository(this._apiVersion3Client)
    if (!cartId) {
      this._context.log.debug('There no cartId going to do createCartAndAddProducts')
      let addItemResponse = await shopgateCartProductActionsRepository.createCartAndAddProducts(products)
      await this._shopgateStorage.set(CART_ID, addItemResponse.cartId)
      return
    }
    try {
      this._context.log.debug('Found Cart ID: ' + cartId + ' and trying to add products with it')
      await shopgateCartProductActionsRepository.addToCart(cartId, products)
    } catch (error) {
      this._context.log.debug('There was an error trying to add products with cartId ' + cartId + '. Now trying to create the cart and add the products')
      let addItemResponse = await shopgateCartProductActionsRepository.createCartAndAddProducts(products)
      await this._shopgateStorage.set(CART_ID, addItemResponse.cartId)
    }
  }

  /**
   * @param {string} cartId
   * @return {Promise<{string,ShopgateCart}>}
   */
  async createAndGet () {
    const bigCommerceCartResponse = await this._apiVersion3Client.post('/carts', {'cartData': true, 'line_items': []})
    const shopgateCartBuilder = new ShopgateCartBuilder(bigCommerceCartResponse)
    return {id: bigCommerceCartResponse.data.id, cart: shopgateCartBuilder.build()}
  }
}

module.exports = ShopgateCartRepository
