const ShopgateCartItem = require('../entity/ShopgateCartItem')
const ShopgateCartProductBuilder = require('../product/factory/ShopgateCartProductBuilder')

class ShopgateCartItemsBuilder {
  /**
   *  @param {object} bigcommerceCartResponse
   */
  constructor (bigcommerceCartResponse) {
    this._bigcommerceCartResponse = bigcommerceCartResponse
  }

  build () {
    let shopgateCartItems = []
    shopgateCartItems = shopgateCartItems.concat(this._getPhysicalItems())

    return shopgateCartItems
  }

  /**
   * @return {ShopgateCartItem[]}
   * @private
   */
  _getPhysicalItems () {
    const physicalItems = []
    this._bigcommerceCartResponse.data.line_items.physical_items.forEach(
      function (physicalItem) {
        const shopgateItemBuilder = new ShopgateCartProductBuilder(physicalItem)
        physicalItems.push(new ShopgateCartItem({
          id: physicalItem.id,
          quantity: physicalItem.quantity,
          type: 'product',
          coupon: {},
          product: shopgateItemBuilder.build(),
          messages: []
        }))
      }
    )
    return physicalItems
  }
}

module.exports = ShopgateCartItemsBuilder
