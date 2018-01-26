class BigCommerceCartLineItems {
  constructor () {
    this._physical = []
    this._digital = []
    this._giftCertificates = []
  }
  /**
   * @returns {BigCommerceCartLineItemDigital[]}
   */
  get digital () {
    return this._digital
  }

  /**
   * @returns {BigCommerceCartLineItemPhysical[]}
   */
  get physical () {
    return this._physical
  }

  /**
   * @returns {BigCommerceCartLineItemGiftCertificate[]}
   */
  get giftCertificate () {
    return this._giftCertificates
  }
}

module.exports = BigCommerceCartLineItems
