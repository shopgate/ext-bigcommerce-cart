'use strict'

const ShopgateCartPipeline = require('./shopgate/CartExtensionPipeline')
const { decorateError } = require('./shopgate/logDecorator')
const ShopgateCartMessage = require('./shopgate/cart/Message')

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

  const shopgateCartPipeline = ShopgateCartPipeline.create(context)
  try {
    await shopgateCartPipeline.addProducts(input.products)
  } catch (err) {
    context.log.error(decorateError(err), 'Failed adding products to cart')
    if (err.code === 422) {
      let ecartError = new Error('Failed to add product to the cart')
      ecartError.code = 'ECART'
      ecartError.errors = [{
        code: 'NOTAVAILABLE',
        message: 'This product is not available anymore',
        translated: true
      }]

      throw ecartError
    }
    throw err
  }

  return { cartId: await shopgateCartPipeline.getCartId() }
}
