'use strict'
const BigCommerce = require('node-bigcommerce')
const sinon = require('sinon')
const assert = require('assert')
const chai = require('chai')
const {describe, it, beforeEach, afterEach} = require('mocha')
let ShopgateCartExtensionPipeline = require('../../../lib/shopgate/CartExtensionPipeline')
const IdentifierConverter = require('../../../lib/shopgate/IdentifierConverter')
const ShopgateCartFactory = require('../../../lib/shopgate/CartFactory')
const BigCommerceCartRepository = require('../../../lib/bigcommerce/CartRepository')
const ShopgateCartMessagesRepository = require('../../../lib/shopgate/CartMessageRepository')
const ShopgateConcurrency = require('../../../lib/shopgate/Concurrency')

const proxyquire = require('proxyquire')

chai.use(require('chai-subset'))
chai.use(require('chai-as-promised')).should()

describe('CartExtensionPipeline - unit', () => {
  /** @type ShopgateCartExtensionPipeline */
  let subjectUnderTest

  const sandbox = sinon.createSandbox()

  let bigCommerceCartRepositoryMock
  let createLineItemSpy

  let storageMock
  const storage = {get: () => {}, set: () => {}}
  const context = {
    log: {error: () => {}},
    storage: {
      extension: storageMock
    }
  }

  let shopgateConcurrencyStub, shopgateConcurrencyCreateStub

  beforeEach(() => {
    createLineItemSpy = sandbox.spy(BigCommerceCartRepository, 'createLineItem')
    storageMock = sandbox.mock(storage)
    const bigCommerceCartRepository = new BigCommerceCartRepository(sinon.createStubInstance(BigCommerce), /** @type BigCommerceStorage */ storage)
    bigCommerceCartRepositoryMock = sandbox.mock(bigCommerceCartRepository)

    shopgateConcurrencyStub = sandbox.createStubInstance(ShopgateConcurrency)
    shopgateConcurrencyCreateStub = sandbox.stub(ShopgateConcurrency, 'create').returns(shopgateConcurrencyStub)

    ShopgateCartExtensionPipeline = proxyquire('../../../lib/shopgate/CartExtensionPipeline', {
      './Concurrency': {
        create: shopgateConcurrencyCreateStub
      }
    })

    subjectUnderTest = new ShopgateCartExtensionPipeline(
      bigCommerceCartRepository,
      new ShopgateCartFactory(),
      new IdentifierConverter(),
      /** @type PipelineContext */ context,
      new ShopgateCartMessagesRepository(storageMock, context.log)
    )
  })

  afterEach(() => {
    sandbox.verifyAndRestore()
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
    shopgateConcurrencyStub.lock.returns(null)
    const errorLogSpy = sandbox.spy(subjectUnderTest._context.log, 'error')

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
    shopgateConcurrencyStub.lock.returns(null)

    const errorLogSpy = sinon.spy(subjectUnderTest._context.log, 'error')

    await subjectUnderTest.updateProducts([{CartItemId: '1', quantity: 1}]).should.eventually.equal(false)
    assert(errorLogSpy.called)
    subjectUnderTest._context.log.error.restore()
  })
})
