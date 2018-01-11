const BigCommerceFactory = require('../bigcommerce/Factory')
const BigCommerceCartRepository = require('../bigcommerce/CartRepository')
const ShopgateExtensionStorage = require('./ExtensionStorage')
const ShopgateCartFactory = require('./CartFactory')

class ShopgateCartExtensionPipeline {
  /**
   * @param {BigCommerceCartRepository} bigCommerceCartRepository
   * @param {ShopgateCartFactory} shopgateCartFactory
   */
  constructor (bigCommerceCartRepository, shopgateCartFactory) {
    this._bigCommerceCartRepository = bigCommerceCartRepository
    this._shopgateCartFactory = shopgateCartFactory
  }

  async addProducts (products) {
    const bigCommerceCart = await this._bigCommerceCartRepository.load()
    const bigCommerceLineItems = []
    products.forEach((product) => {
      bigCommerceLineItems.push(bigCommerceCart.createLineItem(product.quantity, product.productId))
    })
    await this._bigCommerceCartRepository.addItems(bigCommerceCart, bigCommerceLineItems)
  }

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
          name: shopgateCartItem.product.name // TODO add rest of the properties
        },
        messages: []
      }
    })

    return {
      output: {
        currency: shopgateCart.currency,
        messages: shopgateCart.messages,
        text: shopgateCart.text,
        cartItems: pipelineCartItems,
        totals: shopgateCart.totals, // TODO take care of the creation process
        flags: shopgateCart.flags // TODO take care of the creation process
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

    return new ShopgateCartExtensionPipeline(bigCommerceCartRepository, new ShopgateCartFactory())
  }
}

module.exports = ShopgateCartExtensionPipeline
