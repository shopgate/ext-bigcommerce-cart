const BigCommerceCartRepository = require('../../../../../extension/lib/bigcommerce/CartRepository')
const BigCommerceFactory = require('../../../../../extension/lib/bigcommerce/Factory')
const integrationCredentials = require('../../../../../.integration-credentials')
const sinon = require('sinon')

describe('BigCommerceCartRepository - integration', () => {
  let storageMock
  /** @type BigCommerceCartRepository */
  let subjectUnderTest
  const storage = { get: () => {}, set: () => {}, delete: () => {} }
  const bigCommerceFactory = new BigCommerceFactory(integrationCredentials.clientId, integrationCredentials.accessToken, integrationCredentials.storeHash)

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

    return subjectUnderTest.load().should.eventually.containSubset({
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

  it('should provide checkout url', function () {
    storageMock.expects('get').once().returns(cartId)

    return subjectUnderTest.getCheckoutUrl().should.eventually.be.a.string
  })

  it('should remove previously created cart', () => {
    storageMock.expects('get').once().returns(cartId)
    storageMock.expects('delete').once()

    return subjectUnderTest.destroy().should.eventually.be.fulfilled
  })

  it('should not give back previously destroyed cart', function () {
    storageMock.expects('get').once().returns(cartId)
    return subjectUnderTest.load().should.eventually.equal(null)
  })
})
