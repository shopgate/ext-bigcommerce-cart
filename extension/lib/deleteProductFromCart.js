const ShopgateCartPipeline = require('./shopgate/CartExtensionPipeline')

/**
 * @param {PipelineContext} context
 * @param {AddProductsInput} input
 * @returns {Promise<void>}
 */
module.exports = async (context, input) => {
  try {
    await ShopgateCartPipeline.create(context).deleteProductFromCart(input.CartItemIds)
    return {}
  } catch (error) {
    context.log.error(error)
    throw error
  }
}
