const ShopgateCartFactory = require('../../../../../extension/lib/shopgate/CartFactory')
const assert = require('assert')

describe('ShopgateCartFactory', () => {
  let subjectUnderTest
  beforeEach(() => {
    subjectUnderTest = {
      "id": "67002a6a-f205-477d-8bbb-66c9fba53bef",
      "currency": "USD",
      "baseAmount": 30,
      "discountAmount": 0,
      "cartAmount": 30,
      "lineItems": {
        "physical": [
          {
            "id": "c4b6fa3e-3be7-4ea4-aeab-bc4a52e459da",
            "productId": 112,
            "variantId": 3107,
            "name": "[Integration Test] Nutellabrot *Do not touch* ",
            "url": "http:\/\/demoshop-shopgate.mybigcommerce.com\/integration-test-nutellabrot-do-not-touch\/",
            "quantity": 1,
            "isTaxable": true,
            "imageUrl": "https:\/\/cdn3.bigcommerce.com\/s-r5s844ad\/products\/112\/images\/345\/Nutellabrot_1600x1067_8_24116__65804.1512562173.195.195.jpg?c=2",
            "discounts": [

            ],
            "coupons": [

            ],
            "discountAmount": 0,
            "couponAmount": 0,
            "listPrice": 30,
            "salePrice": 30,
            "isRequireShipping": "true"
          }
        ]
      }
    }
  })
  it('should create shopgateCart from bigCommerce cart', () => {
    const expectedShopgateCart = {
      "_isOrderable": true,
      "_isTaxIncluded": false,
      "_messages": [],
      "_text": [],
      "_cartItems": [
        {
          "_id": "c4b6fa3e-3be7-4ea4-aeab-bc4a52e459da",
          "_quantity": 1,
          "_type": "product",
          "_product": {
            "_id": 112,
            "_name": "[Integration Test] Nutellabrot *Do not touch* ",
            "_addtionalInfo": [

            ],
            "_featuredImageUrl": "https:\/\/cdn3.bigcommerce.com\/s-r5s844ad\/products\/112\/images\/345\/Nutellabrot_1600x1067_8_24116__65804.1512562173.195.195.jpg?c=2",
            "_properties": [

            ],
            "_price": {
              "_unit": 30,
              "_default": 30,
              "_special": null
            },
            "_appliedDiscounts": [

            ]
          },
          "_coupon": {},
          "_messages": [

          ]
        }
      ],
      "_totals": [
        {
          "_type": "subTotal",
          "_label": "SubTotal",
          "_amount": 30,
          "_subTotals": [

          ]
        },
        {
          "_type": "discount",
          "_label": "Discount",
          "_amount": 0,
          "_subTotals": [

          ]
        },
        {
          "_type": "grandTotal",
          "_label": "Total",
          "_amount": 30,
          "_subTotals": [

          ]
        },
        {
          "_type": "subTotal",
          "_label": "SubTotal",
          "_amount": 30,
          "_subTotals": [

          ]
        }
      ],
      "_currency": "USD",
      "_flags": {
        "_taxIncluded": false,
        "_orderable": true,
        "_coupons": false
      }
    }


    const shopgateCartFactory = new ShopgateCartFactory()
    const actualShopgateCart = shopgateCartFactory.createFromBigCommerce(subjectUnderTest)
    assert.deepEqual(actualShopgateCart, expectedShopgateCart)
  })
})
