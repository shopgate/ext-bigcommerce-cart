'use strict'

const ShopgateCartPipeline = require('./shopgate/CartExtensionPipeline')
const { decorateError } = require('./shopgate/logDecorator')

/**
 * @param {PipelineContext} context
 * @param {AddProductsInput} input
 * @returns {Promise<AddProductsToCartResponse>}
 */
module.exports = async (context, input) => {
  /*
   * If we try to add a product that IS already in the cart,
   * BigC will respond with "500 / Something went wrong",
   * which can't be distinguished from an actual error in their system.
   *
   * So before we ADD, we need to GET the cart first
   * and then we UPDATE the products which are already present
   * instead of ADDING them.
   *
   * This whole process can take a while and we don't wanna let the user wait for it,
   * so we don't "await" here and optimistically report "success" to the user right away.
   */

  ShopgateCartPipeline.create(context).addProducts(input.products).catch(error => {
    context.log.error(decorateError(error), 'Failed adding products to cart')
  })
  return {}
}
