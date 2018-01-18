/**
 * @typedef {Object} BigCommerceApiCartResponse
 * @property {BigCommerceApiCartData} data
 * /

 /**
 * @typedef {Object} BigCommerceApiCartData
 * @property {string} id
 * @property {BigcommerceCurrency} currency
 * @property {boolean} is_tax_included
 * @property {number} base_amount
 * @property {number} discount_amount
 * @property {number} cart_amount
 * @property {BigcommerceApiCartAppliedCoupon[]} coupons
 * @property {BigcommerceApiCartAppliedDiscount[]} discounts
 * @property {string} created_time
 * @property {string} updated_time
 * @property {BigcommerceApiCartLineItems} line_items
 */

/**
 * @typedef {Object} BigcommerceApiCartLineItems
 * @property {BigcommerceApiCartLineItemPhysical[]} physical_items
 * @property {BigcommerceApiCartLineItemDigital[]} digital_items
 * @property {BigcommerceApiCartLineItemGiftCertificates[]} gift_certificates
 */

/**
 * @typedef {Object} BigcommerceApiCartLineItemPhysical
 * @property {string} id
 * @property {number} product_id
 * @property {number} variant_id
 * @property {string} name
 * @property {number} quantity
 * @property {boolean} taxable
 * @property {string} image_url
 * @property {number} list_price
 * @property {number} sale_price
 * @property {boolean} is_require_shipping
 * @property {boolean} gift_wrapping
 * @property {Array} coupons
 * @property {Array} discounts
 * @property {number} discounted_amount
 * @property {boolean} gift_wrapping
 * @property {number} extended_list_price
 * @property {number} extended_sale_price
 * @property {string} url
 *
 */

/**
 * @typedef {Object} BigcommerceApiCartLineItemDigital
 */

/**
 * @typedef {Object} BigcommerceApiCartLineItemGiftCertificates
 */

/**
 * @typedef {Object} BigcommerceCurrency
 * @property {string} code
 */

/**
 * @typedef {Object} BigcommerceApiCartAppliedCoupon
 * @property {string} id
 * @property {string} code
 * @property {string} name
 * @property {string} slug
 * @property {string} coupon_type
 * @property {number} discounted_amount
 */

/**
 * @typedef {Object} BigcommerceApiCartAppliedDiscount
 * @property {number} id
 * @property {number} discounted_amount
 */
