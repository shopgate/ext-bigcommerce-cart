'use strict'

const ShopgateCartPipeline = require('./shopgate/CartExtensionPipeline')
const { decorateError } = require('./shopgate/logDecorator')

/**
 * @param {PipelineContext} context
 * @param {DeleteProductsInput} input
 * @returns {Promise<{cartId: string}>}
 */
module.exports = async (context, input) => {
  const shopgateCartPipeline = ShopgateCartPipeline.create(context)
  try {
    await shopgateCartPipeline.deleteProductFromCart(input.cartItemIds)
  } catch (error) {
    context.log.error(decorateError(error), 'Failed deleting products from cart')
    throw new Error()
  }

  return { cartId: await shopgateCartPipeline.getCartId() }
}
