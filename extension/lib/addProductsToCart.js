const ShopgateCartPipeline = require('./shopgate/CartExtensionPipeline')

/**
 * @param {PipelineContext} context
 * @param {AddProductsInput} input
 * @param {AddProductsToCartCallback} cb
 * @returns {Promise<void>}
 */
module.exports = async (context, input, cb) => {
  try {
    await ShopgateCartPipeline.create(context).addProducts(input.products)
    cb(null, {})
  } catch (error) {
    context.log.error(error)
    cb(error)
  }
}
