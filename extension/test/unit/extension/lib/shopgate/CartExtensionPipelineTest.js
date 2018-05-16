'use strict'
const BigCommerce = require('node-bigcommerce')
const sinon = require('sinon')
const assert = require('assert')
const chai = require('chai')
const {describe, it, beforeEach, afterEach} = require('mocha')
const ShopgateCartExtensionPipeline = require('../../../../../lib/shopgate/CartExtensionPipeline')
const IdentifierConverter = require('../../../../../lib/shopgate/IdentifierConverter')
const ShopgateCartFactory = require('../../../../../lib/shopgate/CartFactory')
const BigCommerceCartRepository = require('../../../../../lib/bigcommerce/CartRepository')

chai.use(require('chai-subset'))
chai.use(require('chai-as-promised')).should()

describe('CartExtensionPipeline - unit', () => {
  /** @type ShopgateCartExtensionPipeline */
  let subjectUnderTest

  let bigCommerceCartRepositoryMock

  let createLineItemSpy

  let storageMock
  const storage = {get: () => {}, set: () => {}}
  const context = {log: {error: () => {}}}

  beforeEach(() => {
    createLineItemSpy = sinon.spy(BigCommerceCartRepository, 'createLineItem')
    storageMock = sinon.mock(storage)
    const bigCommerceCartRepository = new BigCommerceCartRepository(sinon.createStubInstance(BigCommerce), /** @type BigCommerceStorage */ storage)
    bigCommerceCartRepositoryMock = sinon.mock(bigCommerceCartRepository)
    subjectUnderTest = new ShopgateCartExtensionPipeline(bigCommerceCartRepository, new ShopgateCartFactory(), new IdentifierConverter(), /** @type PipelineContext */ context)
  })

  afterEach(() => {
    bigCommerceCartRepositoryMock.verify()
    bigCommerceCartRepositoryMock.restore()
    storageMock.verify()
    storageMock.restore()
    BigCommerceCartRepository.createLineItem.restore()
  })

  it('should return empty cart when bigcommerce cart repository returns null', () => {
    bigCommerceCartRepositoryMock.expects('load').once().returns(null)

    return subjectUnderTest.get().should.eventually.deep.equal({
      cartItems: [],
      currency: '',
      flags: {
        coupons: false,
        orderable: false,
        taxIncluded: false
      },
      isOrderable: false,
      isTaxIncluded: false,
      messages: [],
      text: [],
      totals: []
    })
  })

  it('should add every shopgate product to bigcommerce cart', (done) => {
    const shopgateProducts = [
      {
        productId: 1,
        quantity: 1
      },
      {
        productId: 25,
        quantity: 2
      }
    ]
    bigCommerceCartRepositoryMock.expects('addItems').once()

    subjectUnderTest.addProducts(shopgateProducts).then(() => {
      assert(createLineItemSpy.calledTwice)
      done()
    })
  })

  it('should provide checkout url', function () {
    const expectedUrl = 'https://astore.mybigcommerce.com/cart.php'
    bigCommerceCartRepositoryMock.expects('getCheckoutUrl').once().returns(expectedUrl)

    return subjectUnderTest.getCheckoutUrl().should.eventually.equal(expectedUrl)
  })

  it('should return true when update product runs without error', async () => {
    bigCommerceCartRepositoryMock.expects('updateItems').once().withArgs([BigCommerceCartRepository.createLineItemUpdate('1', 1)])
    const errorLogSpy = sinon.spy(subjectUnderTest._context.log, 'error')

    await subjectUnderTest.updateProducts([{CartItemId: '1', quantity: 1}]).should.eventually.equal(true)
    assert(errorLogSpy.notCalled)
    subjectUnderTest._context.log.error.restore()
  })

  it('should return false when update product encounters a non-breaking error', async () => {
    bigCommerceCartRepositoryMock.expects('updateItems').once().withArgs([BigCommerceCartRepository.createLineItemUpdate('1', 1)]).callsFake((items, notify) => {
      notify({
        reason: 'reason test message',
        item: {
          itemId: '1',
          quantity: 1
        }
      })
    })
    const errorLogSpy = sinon.spy(subjectUnderTest._context.log, 'error')

    await subjectUnderTest.updateProducts([{CartItemId: '1', quantity: 1}]).should.eventually.equal(false)
    assert(errorLogSpy.calledWith({
      msg: 'Failed updating product',
      reason: 'reason test message',
      cartItemId: '1',
      quantity: 1
    }))
    subjectUnderTest._context.log.error.restore()
  })
})
