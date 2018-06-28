const ShopgateCartMessage = require('./cart/Message')
const { decorateError } = require('./logDecorator')

const CART_LEVEL_MESSAGES = 'cartMessages'

class ShopgateCartMessageRepository {
  /**
   * @param {PipelineStorage} storage
   * @param {Logger} logger
   */
  constructor (storage, logger) {
    this._storage = storage
    this._logger = logger
  }

  /**
   * @param {string} cartId
   * @return {Promise<{cartLevelMessages: Array, cartItemMessages: Array}>}
   */
  async flush (cartId) {
    let cartMessages = []
    try {
      cartMessages = await this._storage.get(getCartMessagesKey(cartId)) || []
    } catch (err) {
      this._logger.error(decorateError(err), 'Unable to get cart messages')

      return { cartLevelMessages: [], cartItemMessages: [] }
    }

    const cartItemMessages = cartMessages.filter(message => message.hasOwnProperty('cartItemId'))
      .map(message => ({
        cartItemId: message.cartItemId,
        type: message.type,
        message: message.message
      }))

    const cartLevelMessages = cartMessages.filter(message => !message.hasOwnProperty('cartItemId'))
      .map(message => ({
        type: message.type,
        message: message.message
      }))

    try {
      await this._storage.del(getCartMessagesKey(cartId))
    } catch (err) {
      this._logger.error(decorateError(err), 'Unable to release cart messages')
    }

    return {
      cartLevelMessages,
      cartItemMessages
    }
  }

  /**
   * @param {string} cartId
   * @param {string} cartItemId
   * @param {string} message
   * @return {Promise<void>}
   */
  async push (cartId, message, cartItemId = null) {
    const cartMessage = {
      type: 'info',
      message
    }

    if (cartItemId) {
      cartMessage.cartItemId = cartItemId
    }

    let messages = []
    try {
      messages = await this._storage.get(getCartMessagesKey(cartId)) || []
    } catch (err) {
      this._logger.error(decorateError(err), 'Unable to read cart messages from extension storage')
    }

    messages.push(cartMessage)

    try {
      await this._storage.set(getCartMessagesKey(cartId), messages)
    } catch (err) {
      this._logger.error(decorateError(err), 'Unable to store cart messages to extension storage')
    }
  }
}

/**
 * @param {string} cartId
 * @return {string}
 */
function getCartMessagesKey (cartId) {
  return `${CART_LEVEL_MESSAGES}_${cartId}`
}

module.exports = ShopgateCartMessageRepository
