const BigCommerceFactory = require('./BigCommerceFactory.js')
const ShopgateStorage = require('./ShopgateStorage')
const ShopgateCartRepository = require('../cart/repository/ShopgateCartRepository')

module.exports = async (context, input, cb) => {
  const bigCommerceFactory = new BigCommerceFactory(
    context.config.clientId,
    context.config.accessToken,
    context.config.storeHash)
  const shopgateStorage = new ShopgateStorage(context)
  const shopgateCartRepository = new ShopgateCartRepository(bigCommerceFactory.createV3(), shopgateStorage, context)
  try {
    await shopgateCartRepository.addProducts(input.products)
    cb(null, {})
  } catch (error) {
    cb(error)
  }
}
