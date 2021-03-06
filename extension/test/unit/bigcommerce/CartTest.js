'use strict'
const chai = require('chai')
chai.use(require('chai-subset'))
chai.use(require('chai-as-promised')).should()

const assert = require('assert')
const BigCommerceCart = require('../../../lib/bigcommerce/Cart')
const BigCommerceCartLineItemPhysical = require('../../../lib/bigcommerce/cart/line_item/Physical')
const BigCommerceCartLineItemDigital = require('../../../lib/bigcommerce/cart/line_item/Digital')

describe('Cart - unit', function () {
  let subjectUnderTest
  let genericExampleItem

  beforeEach(() => {
    subjectUnderTest = new BigCommerceCart('000-000-000-000', 'USD', false, 100, 0, 100)
    genericExampleItem = new BigCommerceCartLineItemPhysical('aaa-aaa-aaa-aaa', 99, 120, 'product name', 'sku', 'product.url', 1, true, 'image.url', 100, 0, true, false)
  })

  it('should find a single products', function () {
    subjectUnderTest.addItem(genericExampleItem)

    subjectUnderTest.findItem('aaa-aaa-aaa-aaa').should.deep.equal(genericExampleItem)
  })

  it('should result in find returning null when no product matches', function () {
    subjectUnderTest.addItem(genericExampleItem)

    assert.strict.equal(subjectUnderTest.findItem('bbb-bbb-bbb-bbb'), null)
  })

  it('should return the total of physical and digital cartLineItems\'s salePrice times quantity', function () {
    const examplePhysicalItem = new BigCommerceCartLineItemPhysical('aaa-aaa-aaa-aaa', 99, 120, 'product name', 'sku', 'product.url', 2, true, 'image.url', 100, 95, true, false)
    const exampleDigitalItem = new BigCommerceCartLineItemDigital('zzz-zzz-zzz-zzz', 22, 32, 'product name', 'sku', 'product.url', 2, true, 'image.url', 35, 24)
    subjectUnderTest.addItem(examplePhysicalItem)
    subjectUnderTest.addItem(genericExampleItem)
    subjectUnderTest.addItem(exampleDigitalItem)

    assert.strict.equal(subjectUnderTest.productsSubTotal, 238)
  })
})
