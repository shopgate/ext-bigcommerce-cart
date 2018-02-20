const BigCommerceCartLineItemDigital = require('./line_item/Digital')
const BigCommerceCartLineItemPhysical = require('./line_item/Physical')
const BigCommerceCartLineItemGiftCertificate = require('./line_item/GiftCertificate')

class BigCommerceCartLineItems {
  constructor () {
    /** @type BigCommerceCartLineItemAbstract */
    this._items = []
  }
  /**
   * @returns {BigCommerceCartLineItemDigital[]}
   */
  get digital () {
    return this._items.filter((item) => {
      return item instanceof BigCommerceCartLineItemDigital
    })
  }

  /**
   * @returns {BigCommerceCartLineItemPhysical[]}
   */
  get physical () {
    return this._items.filter((item) => {
      return item instanceof BigCommerceCartLineItemPhysical
    })
  }

  /**
   * @returns {BigCommerceCartLineItemGiftCertificate[]}
   */
  get giftCertificates () {
    return this._items.filter((item) => {
      return item instanceof BigCommerceCartLineItemGiftCertificate
    })
  }

  /**
   * @param {BigCommerceCartLineItemAbstract} item
   */
  add (item) {
    this._items.push(item)
  }

  /**
   * @param {string} itemId
   * @return {BigCommerceCartLineItemAbstract|null}
   */
  find (itemId) {
    const items = this._items.filter((item) => {
      return item.id === itemId
    })

    if (items.length !== 1) {
      return null
    }

    return items[0]
  }
}

module.exports = BigCommerceCartLineItems
