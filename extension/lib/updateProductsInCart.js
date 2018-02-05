const ShopgateCartPipeline = require('./shopgate/CartExtensionPipeline')

/**
 * @param {PipelineContext} context
 * @param {UpdateProductsInput} input
 * @param {UpdateProductsCallback} cb
 * @returns {Promise<void>}
 */
module.exports = async (context, input, cb) => {
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

    cb(null, messages)
  } catch (error) {
    context.log.error(error)
    cb(error)
  }
}
