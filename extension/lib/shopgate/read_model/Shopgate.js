/**
 * @typedef {Object} PipelineStorageContainer
 * @property {PipelineStorage} device
 * @property {PipelineStorage} user
 */
/**
 * @callback AddProductsToCartCallback
 * @para {Error} [error]
 * @param {ShopgateAddProductResponse} [AddProductResponse]
 */

/**
 *  @typedef {Object} ShopgateAddProductResponse
 */

/**
 *  @typedef {Object} AddProductsInput
 *  @property {Object} sgxsMeta
 *  @property {ShopgateAddProduct[]} products
 */

/**
 * @typedef {Object} ShopgateAddProduct
 * @param {string} productId
 * @param {number} quantity
 */

/**
 * @typedef {Object} PipelineStorage
 * @property {BigCommerceStorageGetter} get
 * @property {BigCommerceStorageSetter} set
 */

/**
 * @typedef {Object} PipelineContext
 * @property {Object} config
 * @property {Object} log
 * @property {PipelineStorageContainer} storage
 */

/**
 * @callback GetCartCallback
 * @para {Error} [error]
 * @param {ShopgateAddProductResponse} [ShopgateCart]
 */

/**
 * @typedef {Object} GetCartInput
 * @property {Object} sgxsMeta
 */
