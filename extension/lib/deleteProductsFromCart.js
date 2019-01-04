'use strict'

const ShopgateCartPipeline = require('./shopgate/CartExtensionPipeline')
const { decorateError } = require('./shopgate/logDecorator')

/**
 * @param {PipelineContext} context
 * @param {DeleteProductsInput} input
 * @returns {Promise<void>}
 */
module.exports = async (context, input) => {
  try {
    await ShopgateCartPipeline.create(context).deleteProductFromCart(input.CartItemIds)
  } catch (error) {
    context.log.error(decorateError(error), 'Failed deleting from cart')
    throw new Error()
  }
}
