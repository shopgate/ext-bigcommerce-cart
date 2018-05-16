'use strict'
const sinon = require('sinon')
const assert = require('assert')
const chai = require('chai')
const BigCommerceCartRepository = require('../../../../../lib/bigcommerce/CartRepository')
const BigCommerceFactory = require('../../../../../lib/bigcommerce/Factory')
const integrationCredentials = require('../../../../../.integration-credentials')
const ShopgateCartFactory = require('../../../../../lib/shopgate/CartFactory')

chai.use(require('chai-subset'))
chai.use(require('chai-as-promised')).should()

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

  it('should add a product', async () => {
    storageMock.expects('set').once().callsFake((cartIdKey, cartIdValue) => { cartId = cartIdValue })
    await subjectUnderTest.addItems([BigCommerceCartRepository.createLineItem(112, 1)]).should.eventually.be.fulfilled
  })

  it('should get the cart of previously added product', () => {
    storageMock.expects('get').once().returns(cartId)

    return subjectUnderTest.load().should.eventually.be.fulfilled.and.containSubset({
      _currency: 'USD',
      _id: cartId,
      _isTaxIncluded: false,
      _lineItems: {
        _items: [
          {
            _productId: 112,
            _variantId: 3107,
            _quantity: 1
          }
        ]
      }
    })
  })

  it('should not allow an previously nonexistent product to be added via update call', async () => {
    storageMock.expects('get').once().returns(cartId)
    const reportWarnings = sinon.spy()

    await subjectUnderTest.updateItems([BigCommerceCartRepository.createLineItemUpdate('000-000-000', 2)], reportWarnings).should.eventually.be.fulfilled
    assert.equal(reportWarnings.called, true, 'An warning should have been reported.')
    assert.equal(reportWarnings.args[0][0].item.itemId, '000-000-000')
  })

  it('should provide checkout url', function (done) {
    storageMock.expects('get').once().returns(cartId)

    // The BigCommerce API call getCheckoutUrl was sometimes throwing an error.
    // We need the delay to give the BigCommerce infrastructure time to replicate their data along all instances
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
    await subjectUnderTest.addItems([BigCommerceCartRepository.createLineItem(112, 2)]).should.eventually.be.fulfilled

    storageMock.expects('get').once().returns(cartId)
    const bigCommerceCart = await subjectUnderTest.load().should.eventually.be.fulfilled
    const shopgateCart = shopgateCartFactory.createFromBigCommerce(bigCommerceCart)

    shopgateCart.totals.should.containSubset([{
      _type: 'grandTotal',
      _label: 'Total',
      /**
       * BigCommerce currently returns $46.05 as cart_amount probably due to an API change between
       * Fr 09th May 16:00 (MEZ) and Mo 14th May 14:36 (MEZ)
       * This seems to be a bug and we already created a ticket for BigCommerce.
       * Before that change BigCommerce returned $42.25
       */
      _amount: 46.05,
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
