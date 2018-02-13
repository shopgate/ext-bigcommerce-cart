const ShopgateCartPipeline = require('./shopgate/CartExtensionPipeline')

/**
 * @param {PipelineContext} context
 * @param {UpdateProductsInput} input
 * @returns {Promise<UpdateCartResponse>}
 */
module.exports = async (context, input) => {
  try {
    const updateSuccess = await ShopgateCartPipeline.create(context).updateProducts(input.CartItem)
    const messages = []
    if (!updateSuccess) {
      messages.push({
        code: 'EUNKNOWN',
        message: 'It was not possible to update all of the items.',
        type: 'error'
      })
    }

    return {messages: messages}
  } catch (error) {
    context.log.error(error)
    throw error
  }
}
