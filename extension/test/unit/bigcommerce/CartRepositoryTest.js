'use strict'
const BigCommerce = require('node-bigcommerce')
const sinon = require('sinon')
const assert = require('assert')
const chai = require('chai')
const BigCommerceCartRepository = require('../../../lib/bigcommerce/CartRepository')
const BigCommerceCart = require('../../../lib/bigcommerce/Cart')
const BigCommerceCartLineItemRequest = require('../../../lib/bigcommerce/cart/LineItemRequest')

chai.use(require('chai-subset'))
chai.use(require('chai-as-promised')).should()

const CUSTOMER_ID_MOCK = 192

describe('BigCommerceCartRepository - unit', function () {
  let bigCommerceMock
  let storageMock
  /** @type BigCommerceCartRepository */
  let subjectUnderTest
  const storage = { get: () => {}, set: () => {} }
  const bigCommerce = new BigCommerce({})
  beforeEach(() => {
    bigCommerceMock = sinon.mock(bigCommerce)
    storageMock = sinon.mock(storage)
    subjectUnderTest = new BigCommerceCartRepository(
      bigCommerce,
      /** @type BigCommerceStorage */
      storage,
      CUSTOMER_ID_MOCK
    )
  })

  afterEach(() => {
    bigCommerceMock.verify()
    bigCommerceMock.restore()
    storageMock.verify()
    storageMock.restore()
  })

  it('should return null when there is no cart id previously stored', function () {
    storageMock.expects('get').once().returns(null)

    return subjectUnderTest.load().should.eventually.equal(null)
  })

  it('should load the cart when there is a cart id available', function () {
    const responseFixture = {
      data: {
        id: '0000-0000-0000-0000',
        currency: { code: 'EUR' },
        tax_included: true,
        base_amount: 10.00,
        discount_amount: 9.00,
        cart_amount: 10.00
      }
    }
    storageMock.expects('get').once().returns('0000-0000-0000-0000')
    bigCommerceMock.expects('get').withArgs('/carts/0000-0000-0000-0000').returns(responseFixture)

    return subjectUnderTest.load().should.eventually.deep.equal(new BigCommerceCart(
      '0000-0000-0000-0000',
      'EUR',
      true,
      10.00,
      9.00,
      10.00
    ))
  })

  it('should add items to the cart', function () {
    storageMock.expects('get').once().returns('0000-0000-0000-0000')
    bigCommerceMock.expects('post').withArgs(
      '/carts/0000-0000-0000-0000/items',
      {
        cartId: '0000-0000-0000-0000',
        line_items: [
          {
            product_id: 42,
            quantity: 1
          }
        ]
      }
    )

    return subjectUnderTest.addItems([ new BigCommerceCartLineItemRequest(42, 1) ]).should.eventually.be.fulfilled
  })

  it('should create the cart when addItems is called and the cart_id was previously not available', function () {
    storageMock.expects('get').once().returns(null)

    bigCommerceMock.expects('post').withArgs(
      '/carts',
      {
        line_items: [
          {
            product_id: 42,
            quantity: 1
          }
        ],
        customer_id: CUSTOMER_ID_MOCK
      }
    ).returns({data: { id: '0000-0000-0000-0000' }})

    return subjectUnderTest.addItems([ new BigCommerceCartLineItemRequest(42, 1) ]).should.eventually.be.fulfilled
  })

  it('should fail getting the checkout url if we don\'t have a cart persisted', function () {
    storageMock.expects('get').once().returns(null)

    return subjectUnderTest.getCheckoutUrl().should.eventually.be.rejectedWith(Error)
  })

  it('should fail getting the checkout url if the bigcommerce response doesn\'t provide checkout_url property', function () {
    storageMock.expects('get').once().returns('0000-0000-0000-0000')
    bigCommerceMock.expects('post').once().withArgs('/carts/0000-0000-0000-0000/redirect_urls').returns(null)

    return subjectUnderTest.getCheckoutUrl().should.eventually.be.rejectedWith(Error)
  })

  it('should update an item in the cart', async () => {
    const cartItems = [
      {
        itemId: 'abc-def-ghi-jkl-mno',
        quantity: 1
      }
    ]
    storageMock.expects('get').once().returns('0000-0000-0000-0000')

    bigCommerceMock.expects('get').withArgs('/carts/0000-0000-0000-0000').returns({
      data: {
        id: '0000-0000-0000-0000',
        currency: {
          code: 'USD'
        },
        line_items: {
          physical_items: [
            {
              id: 'abc-def-ghi-jkl-mno',
              product_id: 42,
              quantity: 1
            }
          ]
        }
      }
    })

    bigCommerceMock.expects('put').withArgs(
      '/carts/0000-0000-0000-0000/items/abc-def-ghi-jkl-mno',
      {
        cart_id: '0000-0000-0000-0000',
        item_id: 'abc-def-ghi-jkl-mno',
        line_item: {
          product_id: 42,
          quantity: 1
        }
      }
    ).returns({data: {id: '0000-0000-0000-0000'}})
    const updateFailureNotifier = sinon.spy()

    await subjectUnderTest.updateItems(cartItems, updateFailureNotifier).should.eventually.be.fulfilled
    assert(updateFailureNotifier.notCalled)
  })

  it('should call updateFailureNotifier callback when update item fails to find item in bigcommerce cart', async () => {
    const cartItems = [
      {
        itemId: 'abc-def-ghi-jkl-mno',
        quantity: 1
      }
    ]
    storageMock.expects('get').once().returns('0000-0000-0000-0000')

    bigCommerceMock.expects('get').withArgs('/carts/0000-0000-0000-0000').returns({
      data: {
        id: '0000-0000-0000-0000',
        currency: {
          code: 'USD'
        },
        line_items: {
          physical_items: [
            {
              id: 'qrs-tuz-wxy-zzz',
              product_id: 42,
              quantity: 1
            }
          ]
        }
      }
    })
    const updateFailureNotifier = sinon.spy()
    await subjectUnderTest.updateItems(cartItems, updateFailureNotifier).should.eventually.be.fulfilled
    assert(updateFailureNotifier.calledWith({item: cartItems[0], reason: 'Item not found in BigCommerce cart'}))
  })

  it('should throw an error when no cart is found during updateItems', async () => {
    const cartItems = [
      {
        itemId: 'abc-def-ghi-jkl-mno',
        quantity: 1
      }
    ]
    storageMock.expects('get').once()
    const updateFailureNotifier = sinon.spy()
    await subjectUnderTest.updateItems(cartItems, updateFailureNotifier).should.eventually.be.rejectedWith(Error)
    assert(updateFailureNotifier.notCalled)
  })

  it('should properly call bigCommerce client delete method when doing a deleteProductsFromCart', function () {
    const cartItemIds = ['abc-def-ghi-jk', 'lmn-opq-rst-uvw']
    storageMock.expects('get').once().returns('0000-0000-0000-0000')
    bigCommerceMock.expects('delete').withArgs('/carts/0000-0000-0000-0000/items/' + cartItemIds[0]).onCall(0)
    bigCommerceMock.expects('delete').withArgs('/carts/0000-0000-0000-0000/items/' + cartItemIds[1]).onCall(1)

    return subjectUnderTest.deleteProductFromCart(cartItemIds).should.eventually.be.fulfilled
  })

  it('should fail to delete cart items when bigCommerce delete operation fails', function () {
    const cartItemIds = ['abc-def-ghi-jk']
    storageMock.expects('get').once().returns('0000-0000-0000-0000')
    bigCommerceMock.expects('delete').withArgs('/carts/0000-0000-0000-0000/items/' + cartItemIds[0]).throws(Error)

    return subjectUnderTest.deleteProductFromCart(cartItemIds).should.eventually.be.rejectedWith(Error)
  })

  it('should fail to delete cart items when no cart id is available', function () {
    const cartItemIds = ['abc-def-ghi-jk']
    storageMock.expects('get').once().returns()
    bigCommerceMock.expects('delete').never()

    return subjectUnderTest.deleteProductFromCart(cartItemIds).should.eventually.be.rejectedWith(Error)
  })
})
