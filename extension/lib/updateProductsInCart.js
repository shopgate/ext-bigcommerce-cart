'use strict'

const ShopgateCartPipeline = require('./shopgate/CartExtensionPipeline')

/**
 * @param {PipelineContext} context
 * @param {UpdateProductsInput} input
 * @returns {Promise<UpdateProductsResponse>}
 */
module.exports = async (context, input) => {
  const shopgateCartPipeline = ShopgateCartPipeline.create(context)
  await shopgateCartPipeline.updateProducts(input.cartItems)

  return { cartId: await shopgateCartPipeline.getCartId() }
}
