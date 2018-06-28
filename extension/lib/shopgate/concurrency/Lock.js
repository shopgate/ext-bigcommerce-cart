const nonce = require('mini-nonce')
const { sleep } = require('./util')

const LOCK_PREFIX = 'lock_'

let storage

class ShopgateConcurrencyLock {
  /**
   * @param {string} name
   * @param {string} owner
   * @param {number} ttl Time to live in milliseconds
   */
  constructor (name, owner, ttl) {
    this._name = name
    this._owner = owner
    this._ttl = ttl
  }

  /**
   * @param {string} name name for the lock
   * @param {number} ttl time to live in milliseconds
   * @param {number} maxWaitTime time to wait for obtaining a lock in milliseconds
   * @return {Promise<ShopgateConcurrencyLock|null>}
   */
  static async tryLock (name, ttl, maxWaitTime = 5000) {
    if (!storage) {
      throw new Error('storage not set')
    }

    if (await isValid(name)) {
      // lock already exists
      return null
    }

    const owner = nonce(32, 'string')
    await storage.set(getKey(name), {
      owner,
      ttl
    })

    const lock = new ShopgateConcurrencyLock(name, owner, ttl)
    if (!await elect(lock, maxWaitTime)) {
      return null
    }

    return lock
  }

  /**
   * @return {Promise<boolean>}
   */
  async isApplied () {
    const lockInformation = await storage.get(getKey(this._name))
    if (!lockInformation) {
      return false
    }

    return lockInformation.owner === this._owner
  }

  /**
   * @return {Promise<boolean>}
   */
  async isExpired () {
    return !await isValid(this._name)
  }

  /**
   * @return {Promise<void>}
   */
  async release () {
    if (!await this.isApplied()) {
      return
    }

    await storage.set(getKey(this._name), null)
  }
}

/**
 * @param {String} name
 * @return {Promise<boolean>}
 */
async function isValid (name) {
  const value = await storage.get(getKey(name))
  if (!value) {
    return false
  }
  return value.ttl > new Date().getTime()
}

function getKey (name) {
  return `${LOCK_PREFIX}-${name}`
}

function useStorage (storageInstance) {
  storage = storageInstance
}

/**
 * Determines if a lock was successful.
 *
 * @param {ShopgateConcurrencyLock} lockInstance
 * @param {number} maxWaitTime
 * @returns {boolean}
 */
async function elect (lockInstance, maxWaitTime) {
  let time = new Date().getTime()
  const maxTime = time + maxWaitTime
  while (time <= maxTime) {
    if (await lockInstance.isApplied() && !await lockInstance.isExpired()) {
      return true
    }

    await sleep(Math.floor(Math.random() * 50))
    time = new Date().getTime()
  }

  return false
}

module.exports = {
  useStorage,
  ShopgateConcurrencyLock,
  validLockExists: isValid
}
