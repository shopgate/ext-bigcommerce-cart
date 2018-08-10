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
    let cartMessages = {}
    try {
      cartMessages = await this._storage.map.get(getCartMessagesKey(cartId)) || {}
    } catch (err) {
      this._logger.error(decorateError(err), 'Unable to get cart messages')
      return { cartLevelMessages: [], cartItemMessages: [] }
    }

    const cartItemMessages = []
    const cartLevelMessages = []

    for (let key in cartMessages) {
      if (cartMessages[key].hasOwnProperty('cartItemId')) {
        cartItemMessages.push({ ...cartMessages[key] })
      } else {
        cartLevelMessages.push({ ...cartMessages[key] })
      }
    }

    try {
      await this._storage.map.del(getCartMessagesKey(cartId))
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

    let messages = {}
    try {
      messages = await this._storage.map.get(getCartMessagesKey(cartId)) || {}
    } catch (err) {
      this._logger.error(decorateError(err), 'Unable to read cart messages from extension storage')
    }

    const messageKey = Object.keys(messages).length ? Object.keys(messages).length : 0

    try {
      if (messageKey < 1) {
        messages[messageKey] = cartMessage
        await this._storage.map.set(getCartMessagesKey(cartId), messages)
      } else {
        await this._storage.map.setItem(cartId, messageKey, cartMessage)
      }
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
