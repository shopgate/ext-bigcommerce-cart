'use strict'
const BigCommerce = require('node-bigcommerce')
const sinon = require('sinon')
const assert = require('assert')
const chai = require('chai')
const {describe, it, beforeEach, afterEach} = require('mocha')
let ShopgateCartExtensionPipeline = require('../../../lib/shopgate/CartExtensionPipeline')
const ShopgateCartFactory = require('../../../lib/shopgate/CartFactory')
const BigCommerceCartRepository = require('../../../lib/bigcommerce/CartRepository')
const BigCommerceRequestRepository = require('../../../lib/bigcommerce/RequestRepository')
const ShopgateCartMessagesRepository = require('../../../lib/shopgate/CartMessageRepository')

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
  const logger = {debug: () => {}}
  const context = {
    log: {error: () => {}},
    storage: {
      extension: storageMock
    }
  }

  beforeEach(() => {
    createLineItemSpy = sandbox.spy(BigCommerceCartRepository, 'createLineItem')
    storageMock = sandbox.mock(storage)
    const bigCommerceRequestRepository = new BigCommerceRequestRepository(sinon.createStubInstance(BigCommerce), logger)
    const bigCommerceCartRepository = new BigCommerceCartRepository(bigCommerceRequestRepository, /** @type BigCommerceStorage */ storage)
    bigCommerceCartRepositoryMock = sandbox.mock(bigCommerceCartRepository)

    subjectUnderTest = new ShopgateCartExtensionPipeline(
      bigCommerceCartRepository,
      new ShopgateCartFactory(),
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

  it('should return the cart in the correct format', async () => {
    const apiResponse = {
      id: '23362cea-f45a-42ff-a05d-b1a6412f94b1',
      customer_id: 0,
      channel_id: 1,
      email: '',
      currency: {
        code: 'USD'
      },
      tax_included: false,
      base_amount: 119,
      discount_amount: 7.75,
      cart_amount: 121.27,
      coupons: [],
      line_items: {
        physical_items: [
          {
            id: 'bd85d6d7-a15b-4769-8262-91e94dd62d28',
            parent_id: null,
            variant_id: 3121,
            product_id: 122,
            sku: '',
            name: 'A friend for Betty',
            url: 'http://demoshop-shopgate.mybigcommerce.com/a-friend-for-betty/',
            quantity: 1,
            taxable: true,
            image_url: 'https://cdn7.bigcommerce.com/s-r5s844ad/products/122/images/366/bettysfriend__49469.1516206916.195.195.jpg?c=2',
            discounts: [
              {
                id: 2,
                discounted_amount: 3.26
              }
            ],
            coupons: [],
            discount_amount: 0,
            coupon_amount: 0,
            list_price: 50,
            sale_price: 50,
            extended_list_price: 50,
            extended_sale_price: 50,
            is_require_shipping: true,
            options: [
              {
                name_id: 1234,
                name: 'Color',
                value_id: 321,
                value: 'Black'
              }
            ]
          },
          {
            id: 'ef5e2a3d-48c3-4c11-bd1c-d681986d25f9',
            parent_id: null,
            variant_id: 377,
            product_id: 46,
            sku: 'DMDDS-SILVER-XS-27071489',
            name: '[Sample] Daventry Meers, dark denim shirt',
            url: 'http://demoshop-shopgate.mybigcommerce.com/sample-daventry-meers-dark-denim-shirt/',
            quantity: 1,
            taxable: true,
            image_url: 'https://cdn7.bigcommerce.com/s-r5s844ad/products/46/images/160/ms_iss45_89209__03012.1348364434.195.195.jpg?c=2',
            discounts: [
              {
                id: 2,
                discounted_amount: 4.49
              }
            ],
            coupons: [],
            discount_amount: 0,
            coupon_amount: 0,
            list_price: 69,
            sale_price: 69,
            extended_list_price: 69,
            extended_sale_price: 69,
            is_require_shipping: true
          }
        ],
        digital_items: [],
        gift_certificates: [],
        custom_items: []
      },
      created_time: '2018-10-26T09:14:26+00:00',
      updated_time: '2018-10-26T09:14:30+00:00'
    }

    bigCommerceCartRepositoryMock.expects('load').once().returns(BigCommerceCartRepository._createFactory().fromApiResponse(apiResponse))

    const expected = {
      isOrderable: true,
      isTaxIncluded: false,
      currency: 'USD',
      messages: [],
      text: [],
      cartItems: [
        {
          id: 'bd85d6d7-a15b-4769-8262-91e94dd62d28',
          quantity: 1,
          type: 'product',
          coupon: {},
          product: {
            id: 122,
            variantId: 3121,
            name: 'A friend for Betty',
            additionalInfo: [],
            featuredImageUrl: 'https://cdn7.bigcommerce.com/s-r5s844ad/products/122/images/366/bettysfriend__49469.1516206916.195.195.jpg?c=2',
            properties: [
              {
                label: 'Color',
                value: 'Black'
              }
            ],
            price: {
              unit: 50,
              default: 50,
              special: null
            },
            appliedDiscounts: []
          },
          messages: []
        },
        {
          id: 'ef5e2a3d-48c3-4c11-bd1c-d681986d25f9',
          quantity: 1,
          type: 'product',
          coupon: {},
          product: {
            id: 46,
            variantId: 377,
            name: '[Sample] Daventry Meers, dark denim shirt',
            additionalInfo: [],
            featuredImageUrl: 'https://cdn7.bigcommerce.com/s-r5s844ad/products/46/images/160/ms_iss45_89209__03012.1348364434.195.195.jpg?c=2',
            properties: [
              {
                label: 'SKU',
                value: 'DMDDS-SILVER-XS-27071489'
              }
            ],
            price: {
              unit: 69,
              default: 69,
              special: null
            },
            appliedDiscounts: []
          },
          messages: []
        }
      ],
      totals: [
        {
          type: 'discount',
          label: 'Discount',
          amount: 7.75,
          subTotals: []
        },
        {
          type: 'grandTotal',
          label: 'Total',
          amount: 121.27,
          subTotals: []
        },
        {
          type: 'subTotal',
          label: 'SubTotal',
          amount: 119,
          subTotals: []
        }
      ],
      flags: {
        taxIncluded: false,
        orderable: true,
        coupons: false
      }
    }
    const actual = await subjectUnderTest.get()

    chai.assert.deepStrictEqual(actual, expected)
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
    const errorLogSpy = sandbox.spy(subjectUnderTest._context.log, 'error')

    await subjectUnderTest.updateProducts([{cartItemId: '1', quantity: 1}]).should.eventually.equal(true)
    assert(errorLogSpy.notCalled)
    subjectUnderTest._context.log.error.restore()
  })

  it('should return false when update product encounters a non-breaking error', async () => {
    bigCommerceCartRepositoryMock.expects('updateItems').once().withArgs([BigCommerceCartRepository.createLineItemUpdate('1', 1)]).callsFake(async (items, notify) => {
      await notify({
        reason: 'reason test message',
        item: {
          itemId: '1',
          quantity: 1
        }
      })
    })

    const errorLogSpy = sinon.spy(subjectUnderTest._context.log, 'error')

    await subjectUnderTest.updateProducts([{cartItemId: '1', quantity: 1}]).should.eventually.equal(false)
    assert(errorLogSpy.called)
    subjectUnderTest._context.log.error.restore()
  })
})
