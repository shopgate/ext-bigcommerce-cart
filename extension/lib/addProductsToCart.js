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
   * Originally, we didn't "await" here in order to not make the user wait for our system talking to Bigcommcerce.
   * But that lead to the first add-to-cart call on an empty cart not working.
   */

  let shopgateCartPipeline = ShopgateCartPipeline.create(context)
  try {
    await shopgateCartPipeline.addProducts(input.products)
  } catch (error) {
    context.log.error(decorateError(error), 'Failed adding products to cart')
    throw new Error()
  }
  return {}
}
