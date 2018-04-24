/**
 * @typedef {Object} PipelineStorageContainer
 * @property {PipelineStorage} extension
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
 * @typedef {Object} PipelineConfiguration
 * @property {string} clientId
 * @property {string} accessToken
 * @property {string} storeHash
 * @property {string} clientSecret
 */

/**
 *  @typedef {Object} GetAuthCheckoutInput
 *  @property {string} url
 */
