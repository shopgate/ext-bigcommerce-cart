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
 * @property {Object} config
 * @property {Object} log
 * @property {PipelineStorageContainer} storage
 */
