class BigCommerceLineItemsBuilder {
  /**
   *  @param {ShopgateCartProduct[]|ShopgateCartProduct} products
   */
  constructor (products) {
    this._products = products
  }

  build () {
    if (Array.isArray(this._products)) {
      const lineItems = []
      for (const product of this._products) {
        lineItems.push(this._makeLineItem(product))
      }
      return lineItems
    }
    return this._makeLineItem(this._products)
  }

  _makeLineItem (product) {
    return {quantity: product.quantity, product_id: product.productId}
  }
}

module.exports = BigCommerceLineItemsBuilder
