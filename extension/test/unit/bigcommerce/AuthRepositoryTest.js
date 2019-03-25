'use strict'
const assert = require('assert')
const jwt = require('jwt-simple')
const AuthRepository = require('../../../lib/bigcommerce/AuthRepository')

describe('BigCommerceAuthRepository - unit', () => {
  const clientId = '1111111'
  const storeHash = '2222222'
  const clientSecret = '123123123'
  const testAuthRepository = AuthRepository.create(clientId, storeHash, clientSecret)

  it('should return jwt token containing the correct information', () => {
    const customerId = '1'
    const redirectLink = 'https://my-shop.com/cart.php?id=123'
    const token = testAuthRepository.preAuthToken(customerId, redirectLink)
    const decodedToken = jwt.decode(token, clientSecret)

    assert.strict.equal(decodedToken.iss, clientId)
    assert.strict.equal(decodedToken.operation, 'customer_login')
    assert.strict.equal(decodedToken.store_hash, storeHash)
    assert.strict.equal(decodedToken.customer_id, customerId)
    assert.strict.equal(decodedToken.redirect_to, redirectLink)
  })
})
