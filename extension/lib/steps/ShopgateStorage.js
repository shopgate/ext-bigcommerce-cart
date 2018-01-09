class ShopgateStorage {
  constructor (context) {
    this._context = context
  }
  get (key) {
    this._context.log.debug('shopgateCartIdRespository GET is called')
    return new Promise((resolve, reject) => {
      this._context.storage.device.get(key, (err, value) => {
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
      this._context.storage.device.set(key, value, (err) => {
        if (err) {
          reject(err)
          return
        }

        resolve(value)
      })
    })
  }
  delete (key) {
    this._context.log.debug('shopgateCartIdRespository GET is called')
    return new Promise((resolve, reject) => {
      this._context.storage.device.del(key, (err, value) => {
        if (err) {
          reject(err)
          return
        }

        resolve(value)
      })
    })
  }
}

module.exports = ShopgateStorage
