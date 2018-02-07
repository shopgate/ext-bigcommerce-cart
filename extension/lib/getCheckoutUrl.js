const ShopgateCartPipeline = require('./shopgate/CartExtensionPipeline')

/**
 * @param {PipelineContext} context
 * @returns {Promise<ShopgateGetCheckoutUrlResponse>}
 */
module.exports = async (context) => {
  try {
    const checkoutUrl = await ShopgateCartPipeline.create(context).getCheckoutUrl()
    return {url: checkoutUrl}
  } catch (error) {
    context.log.error(error)
    throw error
  }
}
