'use strict'

const ShopgateCartPipeline = require('./shopgate/CartExtensionPipeline')

module.exports = async (context, input) => {
  const anonymousPipeline = ShopgateCartPipeline.createForDevice(context)
  const loggedInPipeline = ShopgateCartPipeline.create(context)

  const itemsToAdd = (await anonymousPipeline.get()).cartItems.map(item => ({
    productId: item.product.id,
    quantity: item.quantity
  }))

  await loggedInPipeline.addProducts(itemsToAdd)
  anonymousPipeline.destroyCart()
}
