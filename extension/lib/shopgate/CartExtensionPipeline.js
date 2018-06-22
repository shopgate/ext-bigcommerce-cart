const BigCommerceFactory = require('../bigcommerce/Factory')
const BigCommerceCartRepository = require('../bigcommerce/CartRepository')
const ShopgateExtensionStorage = require('./ExtensionStorage')
const IdentifierConverter = require('./IdentifierConverter')
const ShopgateCartFactory = require('./CartFactory')

class ShopgateCartExtensionPipeline {
  /**
   * @param {BigCommerceCartRepository} bigCommerceCartRepository
   * @param {ShopgateCartFactory} shopgateCartFactory
   * @param {IdentifierConverter} identifierConverter
   * @param {PipelineContext} context
   */
  constructor (bigCommerceCartRepository, shopgateCartFactory, identifierConverter, context) {
    this._bigCommerceCartRepository = bigCommerceCartRepository
    this._shopgateCartFactory = shopgateCartFactory
    this._identifierConverter = identifierConverter
    this._context = context
  }

  /**
   * @param {ShopgateAddProduct[]} products
   * @returns {Promise<void>}
   */
  async addProducts (products) {
    const bigCommerceLineItems = products.map((product) => {
      const {productId, variantId} = this._identifierConverter.extractProductIds(product.productId)

      return BigCommerceCartRepository.createLineItem(productId, product.quantity, variantId)
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
   * @param {ShopgateUpdateProduct[]} cartItems
   * @return {Promise<boolean>}
   */
  async updateProducts (cartItems) {
    let updateSuccess = true
    await this._bigCommerceCartRepository.updateItems(
      cartItems.map((item) => {
        return BigCommerceCartRepository.createLineItemUpdate(item.CartItemId, item.quantity)
      }),
      (failureEvent) => {
        this._context.log.error({
          msg: 'Failed updating product',
          reason: failureEvent.reason,
          cartItemId: failureEvent.item.itemId,
          quantity: failureEvent.item.quantity
        })
        updateSuccess = false
      }
    )

    return updateSuccess
  }

  /**
   * @param {string[]} cartItemIds
   * @return {Promise<void>}
   */
  async deleteProductFromCart (cartItemIds) {
    await this._bigCommerceCartRepository.deleteProductFromCart(cartItemIds)
  }

  /**
   * @returns {Promise<string>}
   */
  getCartId () {
    return this._bigCommerceCartRepository.id
  }

  /**
   * @param {string|null} cartId
   */
  async setCartId (cartId) {
    if (cartId === null || !this._context.meta.userId) {
      await this._bigCommerceCartRepository.useId(cartId)
      return
    }

    await this._bigCommerceCartRepository.assignCustomer(parseInt(this._context.meta.userId), cartId)
  }

  /**
   * @returns {Promise<void>}
   */
  destroyCart () {
    return this._bigCommerceCartRepository.destroy()
  }

  /**
   * @param {PipelineContext} context
   * @returns {ShopgateCartExtensionPipeline}
   */
  static create (context) {
    return context.meta.userId
      ? create(context, context.storage.user)
      : create(context, context.storage.device)
  }

  /**
   * @param {PipelineContext} context
   * @returns {ShopgateCartExtensionPipeline}
   */
  static createForDevice (context) {
    return create(context, context.storage.device)
  }

  /**
   * @param {PipelineContext} context
   * @returns {ShopgateCartExtensionPipeline}
   */
  static createForUser (context) {
    return create(context, context.storage.user)
  }
}

/**
 * @param {PipelineContext} context
 * @param {PipelineStorage} storage
 * @returns {ShopgateCartExtensionPipeline}
 */
const create = (context, storage) => {
  const bigCommerceCartRepository = new BigCommerceCartRepository(
    BigCommerceFactory.createV3(
      context.config.clientId,
      context.config.accessToken,
      context.config.storeHash
    ),
    /** @type BigCommerceStorage */
    new ShopgateExtensionStorage(storage),
    parseInt(context.meta.userId)
  )

  return new ShopgateCartExtensionPipeline(bigCommerceCartRepository, new ShopgateCartFactory(), new IdentifierConverter(), context)
}

module.exports = ShopgateCartExtensionPipeline
