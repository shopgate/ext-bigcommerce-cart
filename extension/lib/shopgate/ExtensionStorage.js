class ShopgateExtensionStorage {
  constructor (storage) {
    this._storage = storage
  }

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

  delete (key) {
    return new Promise((resolve, reject) => {
      this._storage.del(key, (err, value) => {
        if (err) {
          reject(err)
          return
        }

        resolve(value)
      })
    })
  }
}

module.exports = ShopgateExtensionStorage
