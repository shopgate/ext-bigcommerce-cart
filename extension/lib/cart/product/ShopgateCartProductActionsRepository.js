const BigCommerceLineItemsBuilder = require('./BigCommerceLineItemsBuilder')
const BigcommerceUpdateObjectsBuilder = require('./BigcommerceUpdateObjectsBuilder')

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
  async addToCart(cartId, products) {
    const bigCommerceLineItemsBuilder = new BigCommerceLineItemsBuilder(products)
    return await this._apiVersion3Client.post('/carts/' + cartId + '/items', {
      "cartId": cartId,
      "line_items": bigCommerceLineItemsBuilder.build()
    })
  }

  /**
   * @param {ShopgateProduct[]} products
   * @return {Promise.<{cartId, response: *}>}
   */
  async createCartAndAddProducts (products) {
    const bigCommerceLineItemsBuilder = new BigCommerceLineItemsBuilder(products)
    const bigcommerceCartAddProductResponse = await this._apiVersion3Client.post('/carts/', {"line_items": bigCommerceLineItemsBuilder.build()})

    return {cartId: bigcommerceCartAddProductResponse.data.id, 'response': bigcommerceCartAddProductResponse}
  }

  /**
   * @param {array} cartItemIds
   * @param {string} cartId
   * @return {Promise.<object>}
   */
  async removeProductsFromCart (cartItemIds, cartId) {
    const productRemovalPromises = []
    for (const cartItemId of cartItemIds) {
      productRemovalPromises.push(this._apiVersion3Client.delete('/carts/'+ cartId + '/items/' + cartItemId))
    }

    return await Promise.all(productRemovalPromises)
  }

  /**
   *
   * @param {string} cartId
   * @param {ShopgateCart} currentCart
   * @param {object[]} smallCartItems
   * @return {Promise.<*>}
   */
  async updateProductInCart (cartId, currentCart, smallCartItems) {
    const bigcommerceProductUpdatesBuilder = new BigcommerceUpdateObjectsBuilder(currentCart, smallCartItems);
    const productUpdatePromises = []
    for (const bigCommerceUpdate of bigcommerceProductUpdatesBuilder.build()) {
      productUpdatePromises.push(this._apiVersion3Client.put('/carts/'+ cartId + '/items/' + bigCommerceUpdate.cartItemId, {"cart_id": cartId, "item_id": bigCommerceUpdate.cartItemId, "line_item": bigCommerceUpdate.lineItem}))
    }
    return await Promise.all(productUpdatePromises)
  }

}

module.exports = ShopgateCartProductActionsRepository
