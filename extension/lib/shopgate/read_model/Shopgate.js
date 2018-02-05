/**
 * @typedef {Object} PipelineStorageContainer
 * @property {PipelineStorage} device
 * @property {PipelineStorage} user
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
 * @typedef {Object} PipelineConfiguration
 * @property {string} clientId
 * @property {string} accessToken
 * @property {string} storeHash
 * @property {string} clientSecret
 */
