class ShopgateCartItemProductProperty {
  /**
   * @param {string} type
   * @param {string} label
   * @param {string} value
   */
  constructor ({type, label, value}) {
    this._type = type
    this._label = label
    this._value = value
  }

  /**
   * @return {string}
   */
  get type () {
    return this._type
  }

  /**
   * @return {string}
   */
  get label () {
    return this._label
  }

  /**
   * @return {string}
   */
  get value () {
    return this._value
  }
}

module.exports = ShopgateCartItemProductProperty
