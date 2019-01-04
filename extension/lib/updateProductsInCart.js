'use strict'

const ShopgateCartPipeline = require('./shopgate/CartExtensionPipeline')
const { decorateError } = require('./shopgate/logDecorator')

/**
 * @param {PipelineContext} context
 * @param {UpdateProductsInput} input
 * @returns {Promise<Object>}
 */
module.exports = async (context, input) => {
  try {
    await ShopgateCartPipeline.create(context).updateProducts(input.CartItem)

    // there is no benefit of providing messages as they get shown in a popup
    return { messages: [] }
  } catch (error) {
    context.log.error(decorateError(error), 'Failed updating cart')
    throw new Error()
  }
}
