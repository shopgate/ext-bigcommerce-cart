'use strict'
const sinon = require('sinon')
const chai = require('chai')
const Logger = require('bunyan')
const BigCommerce = require('node-bigcommerce')

chai.use(require('chai-subset'))
chai.use(require('chai-as-promised')).should()

const BigCommerceFactory = require('../../lib/bigcommerce/Factory')
const markOrderAsShopgate = require('../../lib/markOrderAsShopgate')

describe('markOrderAsShopgate', () => {
  const sandbox = /** @type sinon */sinon.createSandbox()
  const context = { config: {} }
  let apiClientStub

  beforeEach(() => {
    context.log = sandbox.createStubInstance(Logger)
    apiClientStub = sandbox.createStubInstance(BigCommerce)
    sandbox.stub(BigCommerceFactory, 'createV2').returns(apiClientStub)
  })

  afterEach(() => {
    sandbox.verifyAndRestore()
  })

  it('should send (only) a PUT request to the Bigcommerce API', async () => {
    const input = {
      orderId: '101'
    }
    apiClientStub.put
      .withArgs('/orders/101', sinon.match.any)
      .resolves({})

    await markOrderAsShopgate(context, input)

    sinon.assert.notCalled(apiClientStub.get)
    sinon.assert.notCalled(apiClientStub.post)
    sinon.assert.notCalled(apiClientStub.delete)

    sinon.assert.calledOnce(apiClientStub.put)
    sinon.assert.calledWith(apiClientStub.put, '/orders/101', { staff_notes: sinon.match.string })
  })

  it('should catch and log errors', () => {
    const input = {
      orderId: '101'
    }
    apiClientStub.put
      .rejects(new Error())

    return markOrderAsShopgate(context, input).should.eventually.be.rejected
  })
})
