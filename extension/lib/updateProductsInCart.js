const ShopgateCartPipeline = require('./shopgate/CartExtensionPipeline')

/**
 * @param {PipelineContext} context
 * @param {AddProductsInput} input
 * @param {AddProductsToCartCallback} cb
 * @returns {Promise<void>}
 */
module.exports = async (context, input, cb) => {
  try {
    await ShopgateCartPipeline.create(context).updateProducts(input.CartItem)
    cb(null, {})
  } catch (error) {
    context.log.error(error)
    cb(error)
  }
}
