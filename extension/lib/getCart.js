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
    const cartPipelineResponse = await cartPipeline.get()
    context.log.debug(cartPipelineResponse)
    cb(null, cartPipelineResponse)
  } catch (error) {
    context.log.error(error)
    cb(error)
  }
}
