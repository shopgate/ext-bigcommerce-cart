'use strict'
const assert = require('assert')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

let { ShopgateConcurrencyLock, useStorage } = require('../../../../lib/shopgate/concurrency/Lock')

describe('ShopgateConcurrencyLock - unit', () => {
  const sandbox = sinon.createSandbox()

  let storageGet, storageSet, nonceStub

  beforeEach(() => {
    storageGet = sandbox.stub()
    storageSet = sandbox.stub()
    const storage = {get: storageGet, set: storageSet}

    nonceStub = sandbox.stub()
    const ShopgateConcurrencyLockModule = proxyquire('../../../../lib/shopgate/concurrency/Lock', {
      'mini-nonce': nonceStub
    })
    ShopgateConcurrencyLock = ShopgateConcurrencyLockModule.ShopgateConcurrencyLock
    useStorage = ShopgateConcurrencyLockModule.useStorage

    useStorage(storage)
  })

  afterEach(() => {
    sandbox.verifyAndRestore()
  })

  describe('tryLock', () => {
    it('should obtain a lock when previous one has expired', async () => {
      nonceStub.returns('fakeOwner')

      storageGet.onFirstCall().returns({
        owner: 'previousOwner',
        ttl: new Date().getTime() - 50000
      })

      storageGet.returns({
        owner: 'fakeOwner',
        ttl: new Date().getTime() + 10000
      })

      const lock = await ShopgateConcurrencyLock.tryLock('test', 10000, 1500)
      assert.ok(lock instanceof ShopgateConcurrencyLock)
      assert.ok(storageGet.called)
    })

    it('should return null when there is a lock in place', async () => {
      const fixtureOwner = 'fakeOwner'

      nonceStub.returns(fixtureOwner)
      storageGet.returns({
        owner: 'previousOwner',
        ttl: new Date().getTime() + 50000
      })

      const lock = await ShopgateConcurrencyLock.tryLock('test', 10000, 1500)
      assert.strictEqual(lock, null)
    })

    it('should return null if locking attempt times out', async () => {
      storageGet.returns(null)
      const lock = await ShopgateConcurrencyLock.tryLock('test', 10000, 1000)
      assert.strictEqual(lock, null)
    })
  })

  describe('isApplied', () => {
    it('should return false when there is nothing in storage', async () => {
      storageGet.returns(null)
      const lock = new ShopgateConcurrencyLock('test', 'fakeOwner', 10000)
      assert.strictEqual(await lock.isApplied(), false)
    })

    it('should return false when the owner is not same', async () => {
      storageGet.returns({
        owner: 'anotherOwner',
        ttl: 10000
      })
      const lock = new ShopgateConcurrencyLock('test', 'fakeOwner', 10000)
      assert.strictEqual(await lock.isApplied(), false)
    })

    it('should return true when the owner is same', async () => {
      storageGet.returns({
        owner: 'fakeOwner',
        ttl: 10000
      })
      const lock = new ShopgateConcurrencyLock('test', 'fakeOwner', 10000)
      assert.strictEqual(await lock.isApplied(), true)
    })
  })

  describe('isExpired', () => {
    it('should return true when there is nothing in storage', async () => {
      storageGet.returns(null)
      const lock = new ShopgateConcurrencyLock('test', 'fakeOwner', 10000)
      assert.strictEqual(await lock.isExpired(), true)
    })

    it('should return true when the owner is not same', async () => {
      storageGet.returns({
        owner: 'anotherOwner',
        ttl: 10000
      })
      const lock = new ShopgateConcurrencyLock('test', 'fakeOwner', 10000)
      assert.strictEqual(await lock.isExpired(), true)
    })

    it('should return true when the owner is same but ttl has expired', async () => {
      storageGet.returns({
        owner: 'fakeOwner',
        ttl: new Date().getTime() - 10000
      })
      const lock = new ShopgateConcurrencyLock('test', 'fakeOwner', 10000)
      assert.strictEqual(await lock.isExpired(), true)
    })

    it('should return false when the owner is same and ttl is valid', async () => {
      storageGet.returns({
        owner: 'fakeOwner',
        ttl: new Date().getTime() + 10000
      })
      const lock = new ShopgateConcurrencyLock('test', 'fakeOwner', 10000)
      assert.strictEqual(await lock.isExpired(), false)
    })
  })
})
