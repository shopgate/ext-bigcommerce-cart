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

  /**
   * @param {ShopgateAddProduct[]} products
   * @returns {Promise<void>}
   */
  async addProducts (products) {
    const bigCommerceLineItems = products.map((product) => {
      return BigCommerceCartRepository.createLineItem(parseInt(product.productId), product.quantity)
    })

    await this._bigCommerceCartRepository.addItems(bigCommerceLineItems)
  }

  /**
   * @returns {Promise<ShopgateGetCartResponse>}
   */
  async get () {
    const bigCommerceCart = await this._bigCommerceCartRepository.load()
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
          additionalInfo: shopgateCartItem.product.additionalInfo,
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
      coupons: shopgateCart.flags.supportsCoupons
    }

    return {
      isOrderable: shopgateCart.flags.orderable,
      isTaxIncluded: shopgateCart.flags.taxIncluded,
      currency: shopgateCart.currency,
      messages: shopgateCart.messages,
      text: shopgateCart.text,
      cartItems: pipelineCartItems,
      totals: pipelineCartTotals,
      flags: pipelineCartFlags
    }
  }

  /**
   * @returns {Promise<string>}
   */
  async getCheckoutUrl () {
    return this._bigCommerceCartRepository.getCheckoutUrl()
  }

  /**
   * @param {[Object]} cartItems
   * @return {Promise<void>}
   */
  async updateProducts (cartItems) {
    await this._bigCommerceCartRepository.updateItems(cartItems.map((item) => {
      return BigCommerceCartRepository.createLineItemUpdate(item.CartItemId, item.quantity)
    }))
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
