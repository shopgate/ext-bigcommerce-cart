/**
 * @typedef {Object} BigCommerceApiCartResponse
 * @property {BigCommerceApiCartData} data
 * /

 /**
 * @typedef {Object} BigCommerceApiCartData
 * @property {string} id
 * @property {BigCommerceCurrency} currency
 * @property {boolean} tax_included
 * @property {number} base_amount
 * @property {number} discount_amount
 * @property {number} cart_amount
 * @property {number} customer_id
 * @property {BigCommerceApiCartAppliedCoupon[]} coupons
 * @property {BigCommerceApiCartAppliedDiscount[]} discounts
 * @property {string} created_time
 * @property {string} updated_time
 * @property {BigCommerceApiCartLineItems} line_items
 */

/**
 * @typedef {Object} BigCommerceApiCartLineItems
 * @property {BigCommerceApiCartLineItemPhysical[]} physical_items
 * @property {BigCommerceApiCartLineItemDigital[]} digital_items
 * @property {BigCommerceApiCartLineItemGiftCertificates[]} gift_certificates
 */

/**
 * @typedef {Object} BigCommerceApiCartLineItemPhysical
 * @property {string} id
 * @property {number} product_id
 * @property {number} variant_id
 * @property {string} name
 * @property {string} sku
 * @property {BigCommerceApiCartLineItemPhysical[]} options
 * @property {number} quantity
 * @property {boolean} taxable
 * @property {string} image_url
 * @property {number} list_price
 * @property {number} sale_price
 * @property {boolean} is_require_shipping
 * @property {boolean} gift_wrapping
 * @property {BigCommerceApiCartAppliedCoupon[]} coupons
 * @property {BigCommerceApiCartAppliedDiscount[]} discounts
 * @property {number} discounted_amount
 * @property {boolean} gift_wrapping
 * @property {number} extended_list_price
 * @property {number} extended_sale_price
 * @property {string} url
 *
 */

/**
 * @typedef {Object} BigCommerceApiCartLineItemPhysical
 * @property {number} name_id
 * @property {string} name
 * @property {number} value_id
 * @property {string} value
 */

/**
 * @typedef {Object} BigCommerceApiCartLineItemDigital
 */

/**
 * @typedef {Object} BigCommerceApiCartLineItemGiftCertificates
 */

/**
 * @typedef {Object} BigCommerceCurrency
 * @property {string} code
 */

/**
 * @typedef {Object} BigCommerceApiCartAppliedCoupon
 * @property {string} id
 * @property {string} code
 * @property {string} name
 * @property {string} slug
 * @property {string} coupon_type
 * @property {number} discounted_amount
 */

/**
 * @typedef {Object} BigCommerceApiCartAppliedDiscount
 * @property {number} id
 * @property {number} discounted_amount
 */
