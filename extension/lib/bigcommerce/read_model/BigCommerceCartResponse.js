/**
 * @typedef {Object} BigCommerceCartResponse
 * @property {BigCommerceCartData} data
 * /

 /**
 * @typedef {Object} BigCommerceCartData
 * @property {string} id
 * @property {BigcommerceCurrency} currency
 * @property {boolean} is_tax_included
 * @property {number} base_amount
 * @property {number} discount_amount
 * @property {number} cart_amount
 * @property {BigcommerceAppliedCoupon[]} coupons
 * @property {BigcommerceAppliedDiscount[]} discounts
 * @property {string} created_time
 * @property {string} updated_time
 */

/**
 * @typedef {Object} BigcommerceCurrency
 * @property {string} code
 */

/**
 * @typedef {Object} BigcommerceAppliedCoupon
 * @property {string} id
 * @property {string} code
 * @property {string} name
 * @property {string} slug
 * @property {string} coupon_type
 * @property {number} discounted_amount
 */

/**
 * @typedef {Object} BigcommerceAppliedDiscount
 * @property {number} id
 * @property {number} discounted_amount
 */
