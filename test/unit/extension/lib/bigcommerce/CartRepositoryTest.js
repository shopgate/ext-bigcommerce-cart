const BigCommerceCartRepository = require('../../../../../extension/lib/bigcommerce/CartRepository')
const BigCommerceCart = require('../../../../../extension/lib/bigcommerce/Cart')
const BigCommerceCartLineItemRequest = require('../../../../../extension/lib/bigcommerce/cart/LineItemRequest')
const BigCommerce = require('node-bigcommerce')
const sinon = require('sinon')

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
      storage
    )
  })

  afterEach(() => {
    bigCommerceMock.verify()
    bigCommerceMock.restore()
    storageMock.verify()
    storageMock.restore()
  })

  it('should load empty cart when there is no cart id previously stored', function () {
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
        ]
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
})
