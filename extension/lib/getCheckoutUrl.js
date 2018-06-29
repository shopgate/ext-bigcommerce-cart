'use strict'

const ShopgateCartPipeline = require('./shopgate/CartExtensionPipeline')
const { decorateError } = require('./shopgate/logDecorator')

/**
 * @param {PipelineContext} context
 * @returns {Promise<ShopgateGetCheckoutUrlResponse>}
 */
module.exports = async (context) => {
  try {
    const checkoutUrl = await ShopgateCartPipeline.create(context).getCheckoutUrl()
    return {url: checkoutUrl}
  } catch (error) {
    context.log.error(decorateError(error), 'Failed getting checkout url')
    throw error
  }
}
