const ShopgateCartRepository = require('../cart/repository/ShopgateCartRepository')
const BigCommerceFactory = require('../bigcommerce/store/BigCommerceFactory.js')
const ShopgateStorage = require('./ShopgateStorage')

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
  const shopgateStorage = new ShopgateStorage(context)
  const shopgateCartRepository = new ShopgateCartRepository(bigCommerceFactory.createV3(), shopgateStorage, context)
  context.log.debug('STARTING GET CART')
  try {
    const cart = await shopgateCartRepository.get()
    cb(null, cart)
  } catch (error) {
    cb(error)
  }
}
