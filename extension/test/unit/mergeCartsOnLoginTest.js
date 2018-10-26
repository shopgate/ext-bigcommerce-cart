'use strict'
const sinon = require('sinon')
const Logger = require('bunyan')
const chai = require('chai')
const {describe, it, beforeEach, afterEach} = require('mocha')
const ShopgateCartPipeline = require('../../lib/shopgate/CartExtensionPipeline')
const mergeCartsOnLogin = require('../../lib/mergeCartsOnLogin')

chai.use(require('chai-subset'))
chai.use(require('chai-as-promised')).should()

describe('mergeCartsOnLogin', () => {
  const sandbox = /** @type sinon */sinon.createSandbox()
  const context = {
    meta: {
      deviceId: '9729bcf398c10598aa23a04b3557a4c750c714eb5e177375196660beeb506704',
      userId: '15358639',
      appId: 'shop_31422'
    },
    storage: {
      extension: null,
      device: null,
      user: null
    },
    config: {
      storeHash: null,
      accessToken: null,
      clientId: null,
      clientSecret: null,
      requestTimeout: '15000'
    }
  }
  let anonymousPipelineStub
  let loggedInPipelineStub

  beforeEach(() => {
    context.log = sandbox.createStubInstance(Logger)

    anonymousPipelineStub = sandbox.createStubInstance(ShopgateCartPipeline)
    loggedInPipelineStub = sandbox.createStubInstance(ShopgateCartPipeline)
    sandbox.stub(ShopgateCartPipeline, 'createForDevice').returns(anonymousPipelineStub)
    sandbox.stub(ShopgateCartPipeline, 'createForUser').returns(loggedInPipelineStub)
  })

  afterEach(() => {
    sandbox.verifyAndRestore()
  })

  it('should put all items from the anonymous cart into the user cart', async () => {
    let getCartResponse = {
      isOrderable: true,
      isTaxIncluded: false,
      currency: 'USD',
      messages: [],
      text: [],
      cartItems: [
        {
          id: '95d7e6e1-8787-4e1a-9252-c55cb4c5c19b',
          quantity: 1,
          type: 'product',
          coupon: {},
          product: {
            id: 120,
            name: 'Dalmatian',
            additionalInfo: [],
            featuredImageUrl: 'https://cdn7.bigcommerce.com/s-r5s844ad/products/120/images/364/dalmatian-puppy-care__25239.1513768807.195.195.png?c=2',
            properties: [],
            price: {
              unit: 100,
              default: 100,
              special: null
            },
            appliedDiscounts: []
          },
          messages: []
        },
        {
          id: '28c02f8b-a0ab-4c5a-aef7-fd27eec6c358',
          quantity: 2,
          type: 'product',
          coupon: {},
          product: {
            id: 121,
            name: 'German Shepherd',
            additionalInfo: [],
            featuredImageUrl: 'https://cdn7.bigcommerce.com/s-r5s844ad/products/121/images/365/87788187__37415.1513768875.195.195.jpg?c=2',
            properties: [],
            price: {
              unit: 500,
              default: 500,
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
          amount: 592.25,
          subTotals: []
        },
        {
          type: 'subTotal',
          label: 'SubTotal',
          amount: 600,
          subTotals: []
        }
      ],
      flags: {
        taxIncluded: false,
        orderable: true,
        coupons: false
      }
    }

    anonymousPipelineStub.get.returns(getCartResponse)

    anonymousPipelineStub.getCartId.returns('my_cart_id')
    loggedInPipelineStub.getCartId.returns('user_cart_id')

    await mergeCartsOnLogin(context, {})

    sinon.assert.calledWith(loggedInPipelineStub.addProducts, [
      {productId: 120, quantity: 1},
      {productId: 121, quantity: 2}
    ])

    sinon.assert.calledOnce(anonymousPipelineStub.destroyCart)
    sinon.assert.notCalled(loggedInPipelineStub.setCartId)
  })

  it('should move the cart to loggedin pipeline when cart there does not exist', async () => {
    anonymousPipelineStub.getCartId.returns('my_cart_id')
    loggedInPipelineStub.getCartId.returns(null)

    await mergeCartsOnLogin(context, {})

    sinon.assert.calledWith(loggedInPipelineStub.setCartId, 'my_cart_id')
    sinon.assert.notCalled(loggedInPipelineStub.addProducts)
    sinon.assert.notCalled(anonymousPipelineStub.get)
    sinon.assert.notCalled(anonymousPipelineStub.destroyCart)
  })

  it('should not fail if there is neither an anonymous, nor a logged in cartId', async () => {
    anonymousPipelineStub.getCartId.returns(null)
    loggedInPipelineStub.getCartId.returns(null)

    await mergeCartsOnLogin(context, {})
  })

  it('should catch and log errors', async () => {
    const error = new TypeError('wat')
    anonymousPipelineStub.getCartId.throws(error)
    return mergeCartsOnLogin(context, {}).should.eventually.be.fulfilled
  })
})
