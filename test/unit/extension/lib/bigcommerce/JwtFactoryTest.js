const assert = require('assert')
const jwt = require('jwt-simple')

const JwtFactory = require('../../../../../extension/lib/bigcommerce/JwtFactory')

describe('JwtFactory - unit', () => {
  const clientId = '1111111'
  const storeHash = '2222222'
  const clientSecret = '123123123'
  const testJwtFactory = new JwtFactory(clientId, storeHash, clientSecret)

  it('should return jwt token containing the correct information', () => {
    const customerId = '1'
    const redirectLink = 'https://my-shop.com/cart.php?id=123'
    const token = testJwtFactory.create(customerId, redirectLink)
    const decodedToken = jwt.decode(token, clientSecret)

    assert.equal(decodedToken.iss, clientId)
    assert.equal(decodedToken.operation, 'customer_login')
    assert.equal(decodedToken.store_hash, storeHash)
    assert.equal(decodedToken.customer_id, customerId)
    assert.equal(decodedToken.redirect_to, redirectLink)
  })

  it('should return a jwt token without a redirect link', () => {
    const customerId = '1'
    const token = testJwtFactory.create(customerId)
    const decodedToken = jwt.decode(token, clientSecret)

    assert.equal(decodedToken.iss, clientId)
    assert.equal(decodedToken.operation, 'customer_login')
    assert.equal(decodedToken.store_hash, storeHash)
    assert.equal(decodedToken.customer_id, customerId)
    assert.equal(decodedToken.redirect_to, undefined)
  })
})
