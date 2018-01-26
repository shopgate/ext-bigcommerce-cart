class ShopgateCartText {
  /**
   * @param {string} legal
   */
  constructor (legal) {
    this._legal = legal
  }

  /**
   * @return {string}
   */
  get legal () {
    return this._legal
  }
}

module.exports = ShopgateCartText
