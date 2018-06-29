'use strict'

const ShopgateCartPipeline = require('./shopgate/CartExtensionPipeline')
const { decorateError } = require('./shopgate/logDecorator')

/**
 * @param {PipelineContext} context
 * @param {AddProductsInput} input
 * @returns {Promise<AddProductsToCartResponse>}
 */
module.exports = async (context, input) => {
  try {
    await ShopgateCartPipeline.create(context).addProducts(input.products)
    return {}
  } catch (error) {
    context.log.error(decorateError(error), 'Failed adding products to cart')
    throw error
  }
}
