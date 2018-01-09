const BigCommerceFactory = require('./BigCommerceFactory.js')
const ShopgateCartProductActionsRepository = require('../cart/product/ShopgateCartProductActionsRepository')
const ShopgateCartIdRepository = require('../cart/ShopgateCartIdRepository')

module.exports = async (context, input, cb) => {
  const bigCommerceFactory = new BigCommerceFactory(
    context.config.clientId,
    context.config.accessToken,
    context.config.storeHash)
  const shopgateCartProductActionsRepository = new ShopgateCartProductActionsRepository(bigCommerceFactory.createV3())
  const shopgateCartIdRepository = new ShopgateCartIdRepository(context)
  try {
    const cartId = await shopgateCartIdRepository.get()
    context.log.debug('Found this cartId: ' + cartId)
    const addItemResponse = await shopgateCartProductActionsRepository.addToCart(cartId, input.products)
    context.log.debug('add item response: ' + JSON.stringify(addItemResponse))
    cb(null, {})
  } catch (error) {
    try {
      context.log.debug('add products failed, trying createCartAndAddProductsToIt')
      const addItemResponse = await shopgateCartProductActionsRepository.createCartAndAddProducts(input.products)
      const cartId = await shopgateCartIdRepository.set(addItemResponse.cartId)
      context.log.debug('Successfully added product(s) to a new cart with the id ' + cartId)
      cb(null, {})
    } catch (error) {
      cb(error)
    }
  }
}
