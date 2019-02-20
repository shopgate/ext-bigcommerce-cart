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
    const result = await cartPipeline.get()

    return result;
  } catch (error) {
    context.log.error(decorateError(error), 'Failed getting the cart')
    throw new Error()
  }
}
