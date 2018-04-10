const ShopgateCartPipeline = require('./shopgate/CartExtensionPipeline')

/**
 * @param {PipelineContext} context
 * @returns {Promise<ShopgateGetCartResponse>}
 */
module.exports = async (context) => {
  const cartPipeline = ShopgateCartPipeline.create(context)
  try {
    return await cartPipeline.get()
  } catch (error) {
    context.log.error(error)
    throw error
  }
}
