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
    let cartData = {}

    if (cartId) {
      cartData = await this.loadCart(cartId)
    }
    return this.createCart(cartData)
  }

  createCart (cartData) {
    let shopgateCartBuilder = new ShopgateCartBuilder(cartData)

    return shopgateCartBuilder.build()
  }

  /**
   * @param {string} cartId
   * @return {Promise.<Object>}
   */
  async loadCart (cartId) {
    try {
      this._context.log.debug('Try to get cart data for cartId: ' + cartId)

      return this.createCart(await this._apiVersion3Client.get('/carts/' + cartId))
    } catch (error) {
      if (error.code !== 404) {
        throw new Error(error.message, error.code)
      }
      this._context.log.debug('There was a 404 error when getting cart ||' + JSON.stringify(error))
      await this._shopgateStorage.delete(CART_ID)

      return {}
    }
  }

  /**
   * @param {ShopgateProducts[]}products
   * @return {Promise.<void>}
   */
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
}

module.exports = ShopgateCartRepository
