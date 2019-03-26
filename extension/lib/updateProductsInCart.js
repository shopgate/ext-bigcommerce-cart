'use strict'

const ShopgateCartPipeline = require('./shopgate/CartExtensionPipeline')
const { decorateError } = require('./shopgate/logDecorator')

/**
 * @param {PipelineContext} context
 * @param {UpdateProductsInput} input
 * @returns {Promise<UpdateProductsResponse>}
 */
module.exports = async (context, input) => {
  const shopgateCartPipeline = ShopgateCartPipeline.create(context)
  try {
    await shopgateCartPipeline.updateProducts(input.cartItems)
  } catch (error) {
    context.log.error(decorateError(error), 'Failed updating products in cart')
    throw new Error()
  }

  return { cartId: await shopgateCartPipeline.getCartId() }
}
