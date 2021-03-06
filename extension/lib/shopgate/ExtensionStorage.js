class ShopgateExtensionStorage {
  constructor (storage) {
    this._storage = storage
  }

  /**
   * @param {string} key
   * @return {Promise<*>}
   */
  get (key) {
    return new Promise((resolve, reject) => {
      this._storage.get(key, (err, value) => {
        if (err) {
          reject(err)
          return
        }

        resolve(value)
      })
    })
  }

  /**
   * @param {string} key
   * @param {*} value
   * @return {Promise<*>}
   */
  set (key, value) {
    return new Promise((resolve, reject) => {
      this._storage.set(key, value, (err) => {
        if (err) {
          reject(err)
          return
        }

        resolve(value)
      })
    })
  }

  /**
   * @param {string} key
   * @return {Promise<void>}
   */
  delete (key) {
    return new Promise((resolve, reject) => {
      this._storage.del(key, (err) => {
        if (err) {
          reject(err)
          return
        }

        resolve()
      })
    })
  }
}

module.exports = ShopgateExtensionStorage
