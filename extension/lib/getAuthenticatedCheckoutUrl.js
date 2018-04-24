const { URL } = require('url')
const JwtFactory = require('./bigcommerce/JwtFactory')

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
    const jwtFactory = new JwtFactory(
      context.config.clientId,
      context.config.storeHash,
      context.config.clientSecret)
    const cartUrl = new URL(input.url)
    const token = jwtFactory.create(context.meta.userId, input.url)
    const loginUrl = `${cartUrl.protocol}//${cartUrl.host}/login/token/${token}`
    return {url: loginUrl}
  } catch (error) {
    context.log.error(error)
    throw error
  }
}
