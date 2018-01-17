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
    const bigCommerceLineItems = []
    products.forEach((product) => {
      bigCommerceLineItems.push(BigCommerceCartRepository.createLineItem(product.quantity, product.productId))
    })
    this._storeLogger.logDebug('This is what the bigCommerce lines look like: ' + JSON.stringify(bigCommerceLineItems))
    await this._bigCommerceCartRepository.addItems(bigCommerceLineItems)
    this._storeLogger.logDebug('Looks like items were added successfully')
  }

  /**
   * @returns {Promise<ShopgateAddProductResponse>}
   */
  async get () {
    this._storeLogger.logDebug('starting to get the cart')
    const bigCommerceCart = await this._bigCommerceCartRepository.load()
    // this._storeLogger.logDebug('This is what the bigCommerceCart looks like: ' + JSON.stringify(bigCommerceCart))
    const shopgateCart = this._shopgateCartFactory.createFromBigCommerce(bigCommerceCart)
    const pipelineCartItems = shopgateCart.items.map((shopgateCartItem) => {
      return {
        id: shopgateCartItem.id,
        quantity: shopgateCartItem.quantity,
        type: shopgateCartItem.type,
        coupon: {},
        product: {
          id: shopgateCartItem.product.id,
          name: shopgateCartItem.product.name,
          addtionalInfo: shopgateCartItem.product.addtionalInfo,
          featuredImageUrl: shopgateCartItem.product.featuredImageUrl,
          properties: shopgateCartItem.product.properties,
          price: {
            unit: shopgateCartItem.product.price.unit,
            default: shopgateCartItem.product.price.default,
            special: shopgateCartItem.product.price.special
          },
          appliedDiscounts: []
        },
        messages: []
      }
    })
    const pipelineCartTotals = shopgateCart.totals.map((shopgateCartTotal) => {
      return {
        type: shopgateCartTotal.type,
        label: shopgateCartTotal.label,
        amount: shopgateCartTotal.amount,
        subTotals: []
      }
    })
    const pipelineCartFlags = {
      taxIncluded: shopgateCart.flags.taxIncluded,
      orderable: shopgateCart.flags.orderable,
      coupons: shopgateCart.flags.coupons
    }

    return {
      output: {
        isOrderable: shopgateCart.isOrderable,
        isTaxIncluded: shopgateCart.isTaxIncluded,
        currency: shopgateCart.currency,
        messages: shopgateCart.messages,
        text: shopgateCart.text,
        cartItems: pipelineCartItems,
        totals: pipelineCartTotals,
        flags: pipelineCartFlags
      }
    }
  }

  /**
   * @returns {Promise<string>}
   */
  async getCheckoutUrl () {
    const bigCommerceCart = await this._bigCommerceCartRepository.load()

    if (bigCommerceCart === null) {
      throw new Error('cart not found')
    }

    return this._bigCommerceCartRepository.getCheckoutUrl(bigCommerceCart.id)
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
