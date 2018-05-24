'use strict'
const assert = require('assert')
const sinon = require('sinon')
const chai = require('chai')
const getAuthenticatedCheckoutUrl = require('../../lib/getAuthenticatedCheckoutUrl')
const AuthRepository = require('../../lib/bigcommerce/AuthRepository')

chai.use(require('chai-subset'))
chai.use(require('chai-as-promised')).should()

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
    const testToken = '111.222.333'

    const authRepositoryFactoryStub = sinon.stub(AuthRepository, 'create')
    const authRepositoryStub = sinon.createStubInstance(AuthRepository)
    authRepositoryStub.preAuthToken.returns(testToken)
    authRepositoryFactoryStub.returns(authRepositoryStub)

    const response = await getAuthenticatedCheckoutUrl({...context, meta}, input)

    assert.equal(response.url, baseUrl + '/login/token/' + testToken)

    authRepositoryFactoryStub.restore()
  })

  it('should return an error', async () => {
    const meta = {
      userId: '15358639'
    }
    const error = new TypeError('wat')

    const authRepositoryFactoryStub = sinon.stub(AuthRepository, 'create')
    const authRepositoryStub = sinon.createStubInstance(AuthRepository)
    authRepositoryStub.preAuthToken.throws(error)
    authRepositoryFactoryStub.returns(authRepositoryStub)
    const logSpy = sinon.spy(context.log, 'error')

    getAuthenticatedCheckoutUrl({...context, meta}, input).should.eventually.be.rejectedWith(error)
    assert(logSpy.calledWith(error))

    authRepositoryFactoryStub.restore()
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
