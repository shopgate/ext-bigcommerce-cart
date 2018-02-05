/**
 *  @typedef {Object} UpdateProductsInput
 *  @property {ShopgateUpdateProduct[]} CartItem
 */

/**
 * @typedef {Object} ShopgateUpdateProduct
 * @property {string} CartItemId
 * @property {number} quantity
 */

/** @callback UpdateProductsCallback
 * @param {Error} [err]
 * @param {Object} [response]
 */
