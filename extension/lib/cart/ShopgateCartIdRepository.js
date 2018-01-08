class ShopgateCartIdRepository {
  constructor (context) {
    this._context = context
  }
  get () {
    this._context.log.debug('shopgateCartIdRespository GET is called')
    return new Promise((resolve, reject) => {
      this._context.storage.device.get('cartId', (err, cartId) => {
        if (err) {
          reject(err)
          return
        }

        resolve(cartId)
      })
    })
  }
  set (cartId) {
    return new Promise((resolve, reject) => {
      this._context.storage.device.set('cartId', cartId, (err) => {
        if (err) {
          reject(err)
          return
        }

        resolve(cartId)
      })
    })
  }
}

module.exports = ShopgateCartIdRepository
