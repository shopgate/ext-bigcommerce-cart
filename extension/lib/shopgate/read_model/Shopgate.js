/**
 * @typedef {Object} PipelineStorageContainer
 * @property {PipelineStorage} device
 * @property {PipelineStorage} user
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
