'use strict'

const ShopgateCartPipeline = require('./shopgate/CartExtensionPipeline')
const { decorateError } = require('./shopgate/logDecorator')

/**
 * @param {PipelineContext} context
 * @returns {Promise<ShopgateGetCartResponse>}
 */
module.exports = async (context) => {
  const cartPipeline = ShopgateCartPipeline.create(context)
  try {
    return await cartPipeline.get()
  } catch (error) {
    context.log.error(decorateError(error), 'Failed getting the cart')
    throw error
  }
}
