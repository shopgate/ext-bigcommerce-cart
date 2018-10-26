class IdentifierConverter {
  /**
   * @param {string|number} productId
   * @returns {{productId: number, variantId: number|null}}
   */
  static extractProductIds (productId) {
    productId = String(productId)
    const splitResult = productId.split('-')
    const resultProductId = splitResult.length > 0 ? parseInt(splitResult[0]) : null
    const resultVariantId = splitResult.length > 1 ? parseInt(splitResult[1]) : null

    return {productId: resultProductId, variantId: resultVariantId}
  }

  /**
   * @param {string|number} productId
   * @param {string|number|undefined|null} variantId
   * @returns {string}
   */
  static joinProductIds (productId, variantId) {
    if (variantId === undefined || variantId === null || variantId === '') {
      return productId
    }
    return `${productId}-${variantId}`
  }
}

module.exports = IdentifierConverter
