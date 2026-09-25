/**
 * @typedef sendCartToBigApiInput
 * @property {string} cartId - BigCommerce Cart ID
 */

/**
 * @typedef {Object} CartUpdatePayloadResponse
 * @property {string} path - path to the service call
 * @property {string} method - e.g. PUT, GET, POST, DELETE
 * @property {string} service - service name, e.g. bigcommerce-cart
 * @property {CartUpdatePayloadResponseBody} - body of the call
 * @property {string} version - version of the service call, e.g. `v1`
 */

/**
 * @typedef {Object} CartUpdatePayloadResponseBody
 * @property {string} [userAgent] - user agent of the current user
 */
