const ShopgateCartRepository = require('../cart/ShopgateCartRepository')
const BigCommerceFactory = require('./BigCommerceFactory.js')

/**
 * @param {Object} context
 * @param {GetProductDescriptionInput} input
 * @param {GetCartCallback} cb
 */
module.exports = function (context, input, cb) {
  const bigCommerceFactory = new BigCommerceFactory(
    context.config.clientId,
    context.config.accessToken,
    context.config.storeHash)
  context.log.debug('client id: ' + context.config.clientId)
  const shopgateCartRepository = new ShopgateCartRepository(bigCommerceFactory.createV3())

  context.storage.device.get('cartId', function (err, cartId) {
    context.log.debug('HEY AARON, I am trying to get the cartId from storage. This is what I got: ' + cartId)
    if (err || !cartId) {
      context.log.debug('HEY AARON, I am using createAndGetCart')
      createAndGetCart(shopgateCartRepository, context, cb)
    } else {
      context.log.debug('HEY AARON, I am using getCart')
      getCart(cartId, shopgateCartRepository, context, cb)
    }
  })
}

/**
 * @param {string} cartId
 * @param {ShopgateCartRepository} shopgateCartRepository
 * @param {object} context
 * @param {GetCartCallback} cb
 */
const getCart = async (cartId, shopgateCartRepository, context, cb) => {
  try {
    const cart = await shopgateCartRepository.get(cartId)
    context.log.debug(JSON.stringify(cart))
    cb(null, cart)
  } catch (error) {
    context.log.error('get cart error object: ' + JSON.stringify(error))
    if (error.code === 404) {
      createAndGetCart(shopgateCartRepository, context, cb)
    } else {
      context.log.error('Unable to get shopping cart for cartId: ' + cartId)
      cb(error)
    }
  }
}

/**
 * @param {ShopgateCartRepository} shopgateCartRepository
 * @param {object} context
 * @param {GetCartCallback} cb
 */

const createAndGetCart = async (shopgateCartRepository, context, cb) => {
  try {
    const cartResponse = await shopgateCartRepository.createAndGet()
    context.log.error(JSON.stringify(cartResponse))
    context.storage.device.set('cartId', cartResponse.id, function (err) {
      if (err) {
        context.log.error('Could not store cart id in device storage')
        cb(err)
      }
      context.log.debug('created and got cart: ' + JSON.stringify(cartResponse.cart))
      cb(null, cartResponse.cart)
    })
  } catch (error) {
    context.log.error('Unable to create and get shopping cart for cartId:')
    cb(error)
  }
}
