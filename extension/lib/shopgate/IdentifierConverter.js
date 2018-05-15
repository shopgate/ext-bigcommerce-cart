class IdentifierConverter {
  /**
   * @param {string} productId
   * @returns {{productId: number, variantId: number|null}}
   */
  extractProductIds (productId) {
    productId = String(productId)
    const splitResult = productId.split('-')
    const resultProductId = splitResult.length > 0 ? parseInt(splitResult[0]) : null
    const resultVariantId = splitResult.length > 1 ? parseInt(splitResult[1]) : null

    return {productId: resultProductId, variantId: resultVariantId}
  }
}

module.exports = IdentifierConverter
