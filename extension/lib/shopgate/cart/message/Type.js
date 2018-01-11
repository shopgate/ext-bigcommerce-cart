const ERROR = 'error'
const WARNING = 'warning'
const INFO = 'info'
class ShopgateCartItemMessageType {
  constructor () {
    this._ERROR = ERROR
    this._WARNING = WARNING
    this._INFO = INFO
  }

  /**
   * @return {string}
   */
  get ERROR () {
    return this._ERROR
  }

  /**
   * @return {string}
   */
  get WARNING () {
    return this._WARNING
  }

  /**
   * @return {string}
   */
  get INFO () {
    return this._INFO
  }
}

module.exports = ShopgateCartItemMessageType
