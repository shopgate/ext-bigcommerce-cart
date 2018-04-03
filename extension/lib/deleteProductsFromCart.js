const ShopgateCartPipeline = require('./shopgate/CartExtensionPipeline')

/**
 * @param {PipelineContext} context
 * @param {DeleteProductsInput} input
 * @returns {Promise<void>}
 */
module.exports = async (context, input) => {
  try {
    await ShopgateCartPipeline.create(context).deleteProductFromCart(input.CartItemIds)
  } catch (error) {
    context.log.error(error)
    throw error
  }
}