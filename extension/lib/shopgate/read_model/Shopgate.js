/**
 * @typedef {Object} PipelineStorageContainer
 * @property {PipelineStorage} device
 * @property {PipelineStorage} user
 */
/**
 * @callback AddProductsToCartCallback
 * @param {Error} [error]
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
 * @property {string} productId
 * @property {number} quantity
 */

/**
 * @typedef {Object} PipelineStorage
 * @property {BigCommerceStorageGetter} get
 * @property {BigCommerceStorageSetter} set
 */

/**
 * @typedef {Object} PipelineContext
 * @property {PipelineConfiguration} config
 * @property {Object} log
 * @property {PipelineStorageContainer} storage
 */

/**
 * @callback GetCartCallback
 * @param {Error} [error]
 * @param {ShopgateGetCartResponse} [ShopgateCart]
 */

/**
 * @typedef {Object} ShopgateGetCartResponse
 */

/**
 * @typedef {Object} GetCartInput
 * @property {Object} sgxsMeta
 */

/**
 * @typedef {Object} PipelineConfiguration
 * @property {string} clientId
 * @property {string} accessToken
 * @property {string} storeHash
 * @property {string} clientSecret
 */
