const BigCommerceCartRepository = require('../../../../../extension/lib/bigcommerce/CartRepository')
const BigCommerceFactory = require('../../../../../extension/lib/bigcommerce/Factory')
const integrationCredentials = require('../../../../../.integration-credentials')
const ShopgateCartFactory = require('../../../../../extension/lib/shopgate/CartFactory')
const sinon = require('sinon')
const assert = require('assert')

describe('BigCommerceCartRepository - integration', () => {
  let storageMock
  /** @type BigCommerceCartRepository */
  let subjectUnderTest
  const storage = {get: () => {}, set: () => {}, delete: () => {}}
  const bigCommerceFactory = new BigCommerceFactory(integrationCredentials.clientId, integrationCredentials.accessToken, integrationCredentials.storeHash)
  const shopgateCartFactory = new ShopgateCartFactory()

  let cartId

  beforeEach(() => {
    storageMock = sinon.mock(storage)
    subjectUnderTest = new BigCommerceCartRepository(
      bigCommerceFactory.createV3(),
      /** @type BigCommerceStorage */
      storage
    )
  })

  afterEach(() => {
    storageMock.verify()
    storageMock.restore()
  })

  it('should add a product', () => {
    storageMock.expects('set').once().callsFake((cartIdKey, cartIdValue) => { cartId = cartIdValue })
    return subjectUnderTest.addItems([BigCommerceCartRepository.createLineItem(112, 1)]).should.eventually.be.fulfilled
  })

  it('should get the cart of previously added product', () => {
    storageMock.expects('get').once().returns(cartId)

    return subjectUnderTest.load().should.eventually.be.fulfilled.and.containSubset({
      _currency: 'USD',
      _id: cartId,
      _isTaxIncluded: false,
      _lineItems: {
        _physical: [
          {
            _productId: 112,
            _variantId: 3107,
            _quantity: 1
          }
        ]
      }
    })
  })

  it('should provide checkout url', function (done) {
    storageMock.expects('get').once().returns(cartId)

    // The BigCommerce API call getCheckoutUrl was sometimes throwing an error.
    // We need the timeout to give the BigCommerce infrastructure time to replicate their data along all instances
    setTimeout(async () => {
      try {
        const checkoutUrl = await subjectUnderTest.getCheckoutUrl()
        assert.equal(typeof checkoutUrl, 'string')
        done()
      } catch (error) {
        done(error)
      }
    }, 500)
  })

  it('should remove previously created cart', () => {
    storageMock.expects('get').once().returns(cartId)
    storageMock.expects('delete').once()

    return subjectUnderTest.destroy().should.eventually.be.fulfilled
  })

  it('should not give back previously destroyed cart', async function () {
    storageMock.expects('get').once().returns(cartId)
    await subjectUnderTest.load().should.eventually.be.fulfilled.and.be.equal(null)
  })

  it('should calculate the grand total of the cart correctly', async () => {
    storageMock.expects('set').once().callsFake((cartIdKey, cartIdValue) => { cartId = cartIdValue })
    await subjectUnderTest.addItems([BigCommerceCartRepository.createLineItem(112, 2)])
    storageMock.expects('get').once().returns(cartId)
    const bigCommerceCart = await subjectUnderTest.load()
    const shopgateCart = shopgateCartFactory.createFromBigCommerce(bigCommerceCart)

    shopgateCart.totals.should.containSubset([{
      _type: 'grandTotal',
      _label: 'Total',
      _amount: 42.25,
      _subTotals: []
    }])

    // subtotal will be 50 because discount reduces the subtotal in BigCommerce
    shopgateCart.totals.should.containSubset([{
      _type: 'subTotal',
      _label: 'SubTotal',
      _amount: 50,
      _subTotals: []
    }])

    shopgateCart.totals.should.containSubset([{
      _type: 'discount',
      _label: 'Discount',
      _amount: 7.75,
      _subTotals: []
    }])
  })
})
