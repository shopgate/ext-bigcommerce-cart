'use strict'
const assert = require('assert')
const sinon = require('sinon')
const jwt = require('jwt-simple')
const AuthRepository = require('../../../lib/bigcommerce/AuthRepository')

const context = {
  config:
   { storeHash: '123456',
     accessToken: '123456',
     clientId: '1111111',
     clientSecret: '123123123',
     requestTimeout: '15000'
   }
}

describe('BigCommerceAuthRepository - unit', () => {
  const clientId = '1111111'
  const storeHash = '2222222'
  const clientSecret = '123123123'
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should return jwt token containing the correct information', async () => {
    sandbox.stub(AuthRepository.prototype, 'getBIGCServerTime').returns({ time: 123456 })
    const testAuthRepository = AuthRepository.create(clientId, storeHash, clientSecret)

    const customerId = '1'
    const redirectLink = 'https://my-shop.com/cart.php?id=123'
    const token = await testAuthRepository.preAuthToken(customerId, redirectLink, context)
    const decodedToken = jwt.decode(token, clientSecret)

    assert.strict.equal(decodedToken.iss, clientId)
    assert.strict.equal(decodedToken.operation, 'customer_login')
    assert.strict.equal(decodedToken.store_hash, storeHash)
    assert.strict.equal(decodedToken.customer_id, customerId)
    assert.strict.equal(decodedToken.redirect_to, redirectLink)
  })
})
