const ShopgateCartPipeline = require('./shopgate/CartExtensionPipeline')

/**
 * @param {PipelineContext} context
 * @param {GetCheckoutUrlInput} input
 * @returns {Promise<ShopgateGetCheckoutUrlResponse>}
 */
module.exports = async (context, input) => {
  try {
    const checkoutUrl = await ShopgateCartPipeline.create(context).getCheckoutUrl()
    return {url: checkoutUrl}
  } catch (error) {
    context.log.error(error)
    throw error
  }
}
