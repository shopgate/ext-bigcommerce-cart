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
/*
  context.storage.device.get('cartId', function(err, cartId) {
    if (err || !cartId) {
      createCartAndAddProductsToIt(products, shopgateCartProductActionsRepository, context, cb)
    } else {
      addProductsToCart(cartId, input.products, shopgateCartProductActionsRepository, context, cb)
    }
  })
  */
}

/*
const addProductsToCart = async(cartId, products, shopgateCartProductActionsRepository, context, cb) =>{
  try {
    const addItemResponse = await shopgateCartProductActionsRepository.addToCart(cartId, products)
    context.log.debug('add item response: ' + JSON.stringify(addItemResponse))
    cb(null, {})
  } catch (error) {
    context.log.error('Unable to add products to the cart: ' + JSON.stringify(products))
    cb(error)
  }
}

const createCartAndAddProductsToIt = async(products, shopgateCartProductActionsRepository, context, cb) =>{
  try {
    const addItemResponse = await shopgateCartProductActionsRepository.createCartAndAddProducts(products)
    context.log.debug('add item response: '+ JSON.stringify(addItemResponse))
    context.storage.device.set('cartId', addItemResponse.cartId, function(err){
      if (err) {
        context.log.error('Could not set cart Id in device storage while creating a cart and adding product(s) to it')
      } else {
        context.log.debug('Successfully created cart ' + cartId + 'added products to it and stored the cart id')
        cb(null, {})
      }
    })

  } catch (error) {
    context.log.error('Unable to create a cart and add product to it: ' + JSON.stringify(products))
    cb(error)
  }
}
*/
