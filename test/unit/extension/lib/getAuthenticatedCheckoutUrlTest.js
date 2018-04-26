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
    console.log('response', response)
    assert.equal(response.url.indexOf(baseUrl + '/login/token/'), 0)
  })

  it('should return link to cart because userId is null', async () => {
    const meta = {
      userId: null
    }
    const response = await getAuthenticatedCheckoutUrl({...context, meta}, input)
    assert.equal(response.url, input.url)
  })

  it('should return link to cart because userId is undefined', async () => {
    const meta = {
      userId: undefined
    }
    const response = await getAuthenticatedCheckoutUrl({...context, meta}, input)
    assert.equal(response.url, input.url)
  })

  it('should return link to cart because userId is empty string', async () => {
    const meta = {
      userId: ''
    }
    const response = await getAuthenticatedCheckoutUrl({...context, meta}, input)
    assert.equal(response.url, input.url)
  })

  it('should return link to cart because userId is not defined', async () => {
    const meta = {}
    const response = await getAuthenticatedCheckoutUrl({...context, meta}, input)
    assert.equal(response.url, input.url)
  })
})
