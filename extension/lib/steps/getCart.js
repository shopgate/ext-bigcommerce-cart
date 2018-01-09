const ShopgateCartRepository = require('../cart/repository/ShopgateCartRepository')
const BigCommerceFactory = require('./BigCommerceFactory.js')
const ShopgateCartIdRepository = require('../cart/repository/ShopgateCartIdRepository')

/**
 * @param {Object} context
 * @param {GetProductDescriptionInput} input
 * @param {GetCartCallback} cb
 */
module.exports = async (context, input, cb) => {
  const bigCommerceFactory = new BigCommerceFactory(
    context.config.clientId,
    context.config.accessToken,
    context.config.storeHash)
  const shopgateCartRepository = new ShopgateCartRepository(bigCommerceFactory.createV3())
  const shopgateCartIdRepository = new ShopgateCartIdRepository(context)
  try {
    const cartId = await shopgateCartIdRepository.get()
    context.log.debug('Found this cartId: ' + cartId)
    const cart = await shopgateCartRepository.get(cartId)
    cb(null, cart)
  } catch (error) {
    try {
      context.log.debug('An error occurred while trying to get the cart. Will try createAndGet')
      const cartResponse = await shopgateCartRepository.createAndGet()
      const cartId = await shopgateCartIdRepository.set(cartResponse.id)
      context.log.debug('a cart was created as part of a getCart. It has the id of: ' + cartId)
      cb(null, cartResponse.cart)
    } catch (error) {
      cb(error)
    }
  }
}
