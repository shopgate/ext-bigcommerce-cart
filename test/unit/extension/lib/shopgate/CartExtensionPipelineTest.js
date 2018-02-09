const ShopgateCartExtensionPipeline = require('../../../../../extension/lib/shopgate/CartExtensionPipeline')
const ShopgateCartFactory = require('../../../../../extension/lib/shopgate/CartFactory')
const BigCommerceCartRepository = require('../../../../../extension/lib/bigcommerce/CartRepository')
const BigCommerce = require('node-bigcommerce')
const sinon = require('sinon')
const assert = require('assert')

describe('CartExtensionPipeline - unit', () => {
  /** @type ShopgateCartExtensionPipeline */
  let subjectUnderTest

  let bigCommerceCartRepositoryMock

  let createLineItemSpy

  let storageMock
  const storage = { get: () => {}, set: () => {} }
  const context = { log: { error: () => {} } }

  beforeEach(() => {
    createLineItemSpy = sinon.spy(BigCommerceCartRepository, 'createLineItem')
    storageMock = sinon.mock(storage)
    const bigCommerceCartRepository = new BigCommerceCartRepository(sinon.createStubInstance(BigCommerce),   /** @type BigCommerceStorage */ storage)
    bigCommerceCartRepositoryMock = sinon.mock(bigCommerceCartRepository)
    subjectUnderTest = new ShopgateCartExtensionPipeline(bigCommerceCartRepository, new ShopgateCartFactory(), /** @type PipelineContext */ context)
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
  it('should return false when update product runs without error', function () {
    bigCommerceCartRepositoryMock.expects('updateItems').once().returns()

    return subjectUnderTest.updateProducts([{ productId: '1', quantity: 1 }]).should.eventually.equal(false)
  })

  it('should return true when update product encounters a non-breaking error', function () {
    bigCommerceCartRepositoryMock.expects('updateItems').once().callsFake((items, notify) => {
      notify({
        reason: 'fake reason',
        item: {
          itemId: '21321',
          quantity: 1
        }
      })
    })

    return subjectUnderTest.updateProducts([{ productId: '1', quantity: 1 }]).should.eventually.equal(true)
  })
})
