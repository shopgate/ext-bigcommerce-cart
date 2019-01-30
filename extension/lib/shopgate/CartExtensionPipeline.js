const BigCommerceFactory = require('../bigcommerce/Factory')
const BigCommerceCartRepository = require('../bigcommerce/CartRepository')
const BigCommerceRequestRepository = require('../bigcommerce/RequestRepository')
const ShopgateExtensionStorage = require('./ExtensionStorage')
const IdentifierConverter = require('./IdentifierConverter')
const ShopgateCartFactory = require('./CartFactory')
const { decorateError, decorateDebug } = require('./logDecorator')
const ShopgateCartMessageRepository = require('./CartMessageRepository')

class ShopgateCartExtensionPipeline {
  /**
   * @param {BigCommerceCartRepository} bigCommerceCartRepository
   * @param {ShopgateCartFactory} shopgateCartFactory
   * @param {PipelineContext} context
   * @param {ShopgateCartMessageRepository} messagesRepository
   */
  constructor (bigCommerceCartRepository, shopgateCartFactory, context, messagesRepository) {
    this._bigCommerceCartRepository = bigCommerceCartRepository
    this._shopgateCartFactory = shopgateCartFactory
    this._context = context
    this._messagesRepository = messagesRepository
  }

  /**
   * @param {ShopgateAddProduct[]} products
   * @returns {Promise<void>}
   */
  async addProducts (products) {
    const bigCommerceCart = await this._bigCommerceCartRepository.load()

    const itemsToAdd = []
    const itemsToUpdate = []

    await Promise.all(products.map(async (product) => {
      const {productId, variantId} = IdentifierConverter.extractProductIds(product.productId)

      let found = null
      if (bigCommerceCart && bigCommerceCart.lineItems) {
        found = bigCommerceCart.lineItems._items.find(bcItem => bcItem._productId === productId && (!variantId || bcItem._variantId === variantId))
      }
      if (found) {
        itemsToUpdate.push(BigCommerceCartRepository.createLineItemUpdate(found._id, parseInt(product.quantity) + parseInt(found._quantity)))
      } else {
        itemsToAdd.push(BigCommerceCartRepository.createLineItem(productId, product.quantity, variantId))
      }
    }))

    if (itemsToAdd.length) {
      await this._bigCommerceCartRepository.addItems(itemsToAdd)
    }
    if (itemsToUpdate.length) {
      await this._bigCommerceCartRepository.updateItems(itemsToUpdate, () => {})
    }
  }

  /**
   * @returns {Promise<ShopgateGetCartResponse>}
   */
  async get () {
    const bigCommerceCart = await this._bigCommerceCartRepository.load()
    const shopgateCart = this._shopgateCartFactory.createFromBigCommerce(bigCommerceCart)

    // if there is a cart level lock in place, we try to wait for it to finish before delivering
    const cartId = await this._bigCommerceCartRepository.id

    const cartMessages = await this._messagesRepository.flush(cartId)

    const pipelineCartItems = shopgateCart.items.map((shopgateCartItem) => {
      const messages = cartMessages.cartItemMessages.filter(message => message.cartItemId === shopgateCartItem.id)
        .map(message => ({
          type: message.type,
          message: message.message
        }))

      return {
        id: shopgateCartItem.id,
        quantity: shopgateCartItem.quantity,
        type: shopgateCartItem.type,
        coupon: {},
        product: {
          id: shopgateCartItem.product.id,
          variantId: shopgateCartItem.product.variantId,
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
        messages
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
      messages: cartMessages.cartLevelMessages,
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
    const cartId = await this.getCartId()

    let updateSuccess = true
    try {
      await this._bigCommerceCartRepository.updateItems(
        cartItems.map((item) => {
          return BigCommerceCartRepository.createLineItemUpdate(item.CartItemId, item.quantity)
        }),
        async (failureEvent) => {
          this._context.log.error(decorateDebug({
            reason: failureEvent.reason,
            cartItemId: failureEvent.item.itemId,
            quantity: failureEvent.item.quantity
          }), 'Failed updating product')

          await this._messagesRepository.push(cartId, failureEvent.reason, failureEvent.item.itemId)

          updateSuccess = false
        }
      )
    } catch (err) {
      if (err.code !== 422) {
        await this._messagesRepository.push(cartId, 'We were unable to update the cart. Please try again later.')
        throw err
      }

      // in bigc cart api details of the error are hidden inside of error message
      const errorMessageMatch = err.message.match(/({.+})/)
      let errorMessage = 'Items in your cart couldn\'t be updated. Please try again later.'
      if (errorMessageMatch) {
        try {
          errorMessage = JSON.parse(errorMessageMatch[1]).title
        } catch (err) {
          this._context.log.error(decorateError(err), 'Unable to process the error from BigC api')
        }
      }

      await this._messagesRepository.push(cartId, errorMessage)
    }

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
    new BigCommerceRequestRepository(
      BigCommerceFactory.createV3(
        context.config.clientId,
        context.config.accessToken,
        context.config.storeHash
      ),
      context.log
    ),
    /** @type BigCommerceStorage */
    new ShopgateExtensionStorage(storage),
    parseInt(context.meta.userId)
  )

  return new ShopgateCartExtensionPipeline(
    bigCommerceCartRepository,
    new ShopgateCartFactory(),
    context,
    new ShopgateCartMessageRepository(context.storage.extension, context.log)
  )
}

module.exports = ShopgateCartExtensionPipeline
