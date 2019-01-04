'use strict'

const { URL } = require('url')
const AuthRepository = require('./bigcommerce/AuthRepository')
const { decorateError } = require('./shopgate/logDecorator')

/**
 * @param {PipelineContext} context
 * @param {GetAuthCheckoutInput} input
 * @returns {Promise<ShopgateGetCheckoutUrlResponse>}
 */
module.exports = async (context, input) => {
  if (!context.meta.userId) {
    return {url: input.url}
  }
  try {
    const authRepository = AuthRepository.create(
      context.config.clientId,
      context.config.storeHash,
      context.config.clientSecret)
    const cartUrl = new URL(input.url)
    const token = authRepository.preAuthToken(context.meta.userId, input.url)
    const loginUrl = `${cartUrl.protocol}//${cartUrl.host}/login/token/${token}`
    return {url: loginUrl}
  } catch (error) {
    context.log.error(decorateError(error), 'Failed getting auth url')
    throw new Error()
  }
}
