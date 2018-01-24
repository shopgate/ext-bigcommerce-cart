const ShopgateCartPipeline = require('./shopgate/CartExtensionPipeline')

/**
 * @param {PipelineContext} context
 * @param {GetCheckoutUrlInput} input
 * @param {GetCheckoutUrlCallback} cb
 * @returns {Promise<void>}
 */
module.exports = async (context, input, cb) => {
  try {
    const checkoutUrl = await ShopgateCartPipeline.create(context).getCheckoutUrl()
    cb(null, {url: checkoutUrl})
  } catch (error) {
    context.log.error(error)
    cb(error)
  }
}
