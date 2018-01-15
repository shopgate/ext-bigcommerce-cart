class ShopgateCartText {
  /**
   * @param {string} legal
   */
  constructor ({legal}) {
    this._legal = legal
  }

  get legal () {
    return this._legal
  }
}

module.exports = ShopgateCartText
