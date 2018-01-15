const BigCommerceFactory = require('../bigcommerce/Factory')
const BigCommerceCartRepository = require('../bigcommerce/CartRepository')
const ShopgateExtensionStorage = require('./ExtensionStorage')
const ShopgateCartFactory = require('./CartFactory')
const StoreLogger = require('./logger/StoreLogger')

class ShopgateCartExtensionPipeline {
  /**
   * @param {BigCommerceCartRepository} bigCommerceCartRepository
   * @param {ShopgateCartFactory} shopgateCartFactory
   */
  constructor (bigCommerceCartRepository, shopgateCartFactory, storeLogger) {
    this._bigCommerceCartRepository = bigCommerceCartRepository
    this._shopgateCartFactory = shopgateCartFactory
    this._storeLogger = storeLogger
  }

  async addProducts (products) {
    const bigCommerceCart = await this._bigCommerceCartRepository.load()
    const bigCommerceLineItems = []
    products.forEach((product) => {
      bigCommerceLineItems.push(bigCommerceCart.createLineItem(product.quantity, product.productId))
    })
    await this._bigCommerceCartRepository.addItems(bigCommerceCart, bigCommerceLineItems)
  }

  /**
   * @returns {Promise<ShopgateAddProductResponse>}
   */
  async get () {
    const bigCommerceCart = await this._bigCommerceCartRepository.load()
    const shopgateCart = this._shopgateCartFactory.createFromBigCommerce(bigCommerceCart)
    const pipelineCartItems = shopgateCart.items.map((shopgateCartItem) => {
      return {
        id: shopgateCartItem.id,
        quantity: shopgateCartItem.quantity,
        type: 'product',
        coupon: {},
        product: {
          id: shopgateCartItem.product.id,
          name: shopgateCartItem.product.name,
          addtionalInfo: shopgateCartItem.product.addtionalInfo,
          featuredImageUrl: shopgateCartItem.product.featuredImageUrl,
          properties: shopgateCartItem.product.properties,
          price: shopgateCartItem.product.price,
          appliedDiscounts: []
        },
        messages: []
      }
    })
    this._storeLogger.logDebug('this is what the shopgateCart looks like: ' + JSON.stringify(shopgateCart))
    return {
      output: {
        isOrderable: shopgateCart.isOrderable,
        isTaxIncluded: shopgateCart.isTaxIncluded,
        currency: shopgateCart.currency,
        messages: shopgateCart.messages,
        text: shopgateCart.text,
        cartItems: pipelineCartItems,
        totals: shopgateCart.totals,
        flags: shopgateCart.flags
      }
    }
  }

  /**
   * @param {PipelineContext} context
   * @returns {ShopgateCartExtensionPipeline}
   */
  static create (context) {
    const bigCommerceFactory = new BigCommerceFactory(
      context.config.clientId,
      context.config.accessToken,
      context.config.storeHash)

    const bigCommerceCartRepository = new BigCommerceCartRepository(
      bigCommerceFactory.createV3(),
      /** @type BigCommerceStorage */
      new ShopgateExtensionStorage(context.storage.device))

    return new ShopgateCartExtensionPipeline(bigCommerceCartRepository, new ShopgateCartFactory(), new StoreLogger(context.log))
  }
}

module.exports = ShopgateCartExtensionPipeline
