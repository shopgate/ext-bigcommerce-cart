/*
 {
  "id": "string",
  "variant_id": 0,
  "product_id": 0,
  "name": "string",
  "url": "http://example.com",
  "quantity": 0,
  "is_taxable": true,
  "image_url": "http://example.com",
  "discounts": [
    {
      "id": 0,
      "discounted_amount": 0
    }
  ],
  "coupons": [
    {
      "id": "string",
      "code": "string",
      "name": "string",
      "slug": "string",
      "coupon_type": "string",
      "discounted_amount": 0
    }
  ],
  "discount_amount": 0,
  "coupon_amount": 0,
  "list_price": 0,
  "sale_price": 0,
  "extended_list_price": 0,
  "extended_sale_price": 0,
  "is_require_shipping": true,
  "gift_wrapping": {}
}
 */
const BigCommerceCartLineItemAbstract = require('./Abstract')

class BigCommerceCartLineItemPhysical extends BigCommerceCartLineItemAbstract {
  constructor ({id, productId, variantId, name, url, quantity, isTaxable, imageUrl, listPrice, salePrice, isRequireShipping, giftWrapping}) {
    super(id, productId, variantId, name, url, quantity, isTaxable, imageUrl, listPrice, salePrice)
    this._isRequireShipping = isRequireShipping
    this._giftWrapping = giftWrapping
  }
}

module.exports = BigCommerceCartLineItemPhysical
