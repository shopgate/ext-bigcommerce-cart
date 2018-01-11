// aggregate root, not an entity as it has no identity
// we still might go with value object and make this class immutable - this would require us to expose ShopgateCartTotal as a type
class ShopgateCart {
  addTotal (type, label, amount) {}
  get flags () {}
  get totals () {}
  get currency () {}

  /**
   * @returns {ShopgateCartItem[]}
   */
  get items () {}
  get messages () {}
}

module.exports = ShopgateCart
