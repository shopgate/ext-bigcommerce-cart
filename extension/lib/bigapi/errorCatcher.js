const { decorateError } = require('../shopgate/logDecorator')

/**
 * BigAPI Cart saving error catcher.
 * We don't need to notify the customer about these errors,
 * so we disregard them here. We should catch them via logging service.
 *
 * @param {Error} error
 * @param {PipelineContext} context
 */
module.exports = async (error, context) => {
  if (!error) {
    return
  }

  context.log.error(decorateError(error))
}
