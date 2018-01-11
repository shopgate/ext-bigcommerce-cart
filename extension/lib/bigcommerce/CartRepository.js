class BigCommerceCartRepository {
  /**
   * @param {BigCommerce} client Api V3 client
   * @param {BigCommerceStorage} storage
   */
  constructor (client, storage) {}

  /**
   * @return {Promise<BigCommerceCart>}
   */
  async load () {
    // validate existing cart id, return the BigCommerceCart instance
  }

  /**
   * @param {BigCommerceCart} cart
   * @param {BigCommerceCartLineItemRequest[]} items
   * @returns {Promise<void>}
   */
  async addItems (cart, items) {
    // add items to the cart, persist them via client
  }
}

module.exports = BigCommerceCartRepository
