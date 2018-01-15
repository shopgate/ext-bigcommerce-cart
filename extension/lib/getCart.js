const ShopgateCartPipeline = require('./shopgate/CartExtensionPipeline')

/**
 * @param {PipelineContext} context
 * @param {GetCartInput} input
 * @param {GetCartCallback} cb
 * @returns {Promise<void>}
 */
module.exports = async (context, input, cb) => {
  const cartPipeline = ShopgateCartPipeline.create(context)
  try {
    cb(null, await cartPipeline.get().output)
  } catch (error) {
    context.log.error(error)
    cb(error)
  }
}
