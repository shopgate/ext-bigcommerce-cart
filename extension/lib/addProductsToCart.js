const ShopgateCartPipeline = require('./shopgate/CartExtensionPipeline')

/**
 * @param {PipelineContext} context
 * @param {AddProductsInput} input
 * @returns {Promise<AddProductsToCartResponse>}
 */
module.exports = async (context, input) => {
  try {
    await ShopgateCartPipeline.create(context).addProducts(input.products)
    return {}
  } catch (error) {
    context.log.error(error)
    throw error
  }
}
