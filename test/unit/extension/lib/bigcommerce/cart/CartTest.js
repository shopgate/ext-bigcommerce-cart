const BigCommerceCart = require('../../../../../../extension/lib/bigcommerce/Cart')
const BigCommerceCartLineItemAbstract = require('../../../../../../extension/lib/bigcommerce/cart/line_item/Abstract')
const assert = require('assert')

describe('Cart - unit', function () {
  let subjectUnderTest

  beforeEach(() => {
    subjectUnderTest = new BigCommerceCart('000-000-000-000', 'USD', false, 100, 0, 100)
  })

  it('should find a products', function () {
    const exampleItem = new BigCommerceCartLineItemAbstract('aaa-aaa-aaa-aaa', 99, 120, 'product name', 'product.url', 1, true, 'image.url', 100, 0)
    subjectUnderTest.addItem(exampleItem)
    subjectUnderTest.findItem('aaa-aaa-aaa-aaa').should.deep.equal(exampleItem)
  })

  it('find should return null when no product is matches', function () {
    const exampleItem = new BigCommerceCartLineItemAbstract('aaa-aaa-aaa-aaa', 99, 120, 'product name', 'product.url', 1, true, 'image.url', 100, 0)
    subjectUnderTest.addItem(exampleItem)
    assert.equal(subjectUnderTest.findItem('bbb-bbb-bbb-bbb'), null)
  })
})
