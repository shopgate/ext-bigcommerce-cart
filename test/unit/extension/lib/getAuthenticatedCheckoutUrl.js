const assert = require('assert')

const getAuthenticatedCheckoutUrl = require('../../../../extension/lib/getAuthenticatedCheckoutUrl')

describe('getAuthenticatedCheckoutUrl - unit', () => {
  const baseUrl = 'https://my-shop.com'
  const context = {
    config: {
      storeHash: 'storehash',
      accessToken: 'accesstoken',
      clientId: 'clientid',
      clientSecret: 'clientSecret',
      requestTimeout: '15000'
    },
    log: {
      error: msg => {}
    }
  }
  const input = {
    url: baseUrl + '/cart.php?id=123456'
  }

  it('should return token url', async () => {
    const meta = {
      userId: '15358639'
    }
    const response = await getAuthenticatedCheckoutUrl({...context, meta}, input)
    assert.equal(response.url.indexOf(baseUrl + '/login/token/'), 0)
  })

  it('should return link to cart because there is no userId', async () => {
    const meta = {
      userId: null
    }
    const response = await getAuthenticatedCheckoutUrl({...context, meta}, input)
    assert.equal(response.url, input.url)
  })
})
