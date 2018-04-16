'use strict'

const ShopgateCartPipeline = require('./shopgate/CartExtensionPipeline')

/**
 * @param {PipelineContext} context
 * @param {Object} input
 * @returns {Promise<void>}
 */
module.exports = async (context, input) => {
  try {
    const anonymousPipeline = ShopgateCartPipeline.createForDevice(context)
    const loggedInPipeline = ShopgateCartPipeline.create(context)

    const itemsToAdd = (await anonymousPipeline.get()).cartItems.map(item => ({
      productId: item.product.id,
      quantity: item.quantity
    }))

    await loggedInPipeline.addProducts(itemsToAdd)
    await anonymousPipeline.destroyCart()
  } catch (error) {
    context.log.error(error)
    throw error
  }
}
