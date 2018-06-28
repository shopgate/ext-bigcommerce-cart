const { sleep } = require('./concurrency/util')
const { ShopgateConcurrencyLock, useStorage, validLockExists } = require('./concurrency/Lock')

class ShopgateConcurrency {
  /**
   * @param {number} maxWaitTime Maximal time to wait in milliseconds
   * @param {function} shouldInterruptCallback A function occasionally executed to determine if wait can be interrupted before the time runs out
   * @returns {Promise}
   */
  async wait (maxWaitTime, shouldInterruptCallback) {
    let time = new Date().getTime()
    const maxTime = time + maxWaitTime
    while (time <= maxTime) {
      if (shouldInterruptCallback()) {
        break
      }

      await sleep(Math.floor(Math.random() * 50))
      time = new Date().getTime()
    }
  }

  /**
   * @return {ShopgateConcurrencyLock}
   */
  async lock (name, ttl) {
    return ShopgateConcurrencyLock.tryLock(name, ttl)
  }

  /**
   * @param {string} name
   * @return {Promise<boolean>}
   */
  async isLockValid (name) {
    return validLockExists(name)
  }

  /**
   * @param {PipelineStorage} storage
   * @return {ShopgateConcurrency}
   */
  static create (storage) {
    useStorage(storage)
    return new ShopgateConcurrency()
  }
}

module.exports = ShopgateConcurrency
