const ShopgateCartPipeline = require('./shopgate/CartExtensionPipeline')

/**
 * @param {PipelineContext} context
 * @param {UpdateProductsInput} input
 * @returns {Promise<UpdateCartMessage[]>}
 */
module.exports = async (context, input) => {
  try {
    const warningsPresent = await ShopgateCartPipeline.create(context).updateProducts(input.CartItem)
    // todo see about proper way to send an warning in case there are non breaking errors present.
    const messages = []
    if (warningsPresent) {
      messages.push({
        code: 'EUNKNOWN',
        message: 'It was not possible to update all of the items.',
        type: 'error'
      })
    }

    return messages
  } catch (error) {
    context.log.error(error)
    throw error
  }
}
