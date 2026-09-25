'use strict'

/**
 * Sends payload to bigApi service to save the cart with the user_agent (if exists)
 *
 * @param {PipelineContext} context
 * @param {sendCartToBigApiInput} input
 * @returns {Promise<CartUpdatePayloadResponse>}
 */
module.exports = async (context, input) => {
  const { web: userAgent, app, deviceType } = await context.device.getInfo()

  const data = JSON.stringify({
    userAgent,
    app,
    deviceType
  })

  return {
    service: 'bigcommerce-cart',
    version: 'v1',
    method: 'PUT',
    path: `shops/${context.meta.appId.replace('shop_', '')}/carts/${input.cartId}`,
    body: { userAgent: data }
  }
}
