const ShopgateCartRepository = require('../cart/ShopgateCartRepository')
const BigCommerceFactory = require('./BigCommerceFactory.js')
const ShopgateCartIdRepository = require('../cart/ShopgateCartIdRepository')

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
    getCart(cartId, shopgateCartRepository, shopgateCartIdRepository, context, cb)
  } catch (error) {
    context.log.debug('Unable to find cartId. Calling createAndGetCart')
    createAndGetCart(shopgateCartRepository, shopgateCartIdRepository, context, cb)
  }
}

/**
 * @param {string} cartId
 * @param {ShopgateCartRepository} shopgateCartRepository
 * @param {ShopgateCartIdRepository} shopgateCartIdRepository
 * @param {object} context
 * @param {GetCartCallback} cb
 */
const getCart = async (cartId, shopgateCartRepository, shopgateCartIdRepository, context, cb) => {
  try {
    const cart = await shopgateCartRepository.get(cartId)
    context.log.debug(JSON.stringify(cart))
    cb(null, cart)
  } catch (error) {
    context.log.error('get cart error object: ' + JSON.stringify(error))
    if (error.code === 404) {
      createAndGetCart(shopgateCartRepository, shopgateCartIdRepository, context, cb)
    } else {
      context.log.error('Unable to get shopping cart for cartId: ' + cartId)
      cb(error)
    }
  }
}

/**
 * @param {ShopgateCartRepository} shopgateCartRepository
 * @param {ShopgateCartIdRepository} shopgateCartIdRepository
 * @param {object} context
 * @param {GetCartCallback} cb
 */

const createAndGetCart = async (shopgateCartRepository, shopgateCartIdRepository, context, cb) => {
  try {
    const cartResponse = await shopgateCartRepository.createAndGet()
    context.log.error(JSON.stringify(cartResponse))
    const cartId = await shopgateCartIdRepository.set(cartResponse.id)
    context.log.debug('a cart was created as part of a getCart. It has the id of: ' + cartId)
    cb(null, cartResponse.cart)
  } catch (error) {
    context.log.error('Unable to create and get shopping cart for cartId:')
    cb(error)
  }
}
