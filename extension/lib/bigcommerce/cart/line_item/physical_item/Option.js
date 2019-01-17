class BigCommerceCartLineItemPhysicalOption {
  /**
   * @param {number} id
   * @param {string} name
   * @param {string} value
   * @param {number} valueId
   */
  constructor ({id, name, value, valueId}) {
    this._id = id
    this._name = name
    this._value = value
    this._valueId = valueId
  }

  /**
   * @return {number}
   */
  get id () {
    return this._id
  }

  /**
   * @return {string}
   */
  get name () {
    return this._name
  }

  /**
   * @return {string}
   */
  get value () {
    return this._value
  }

  /**
   * @return {number}
   */
  get valueId () {
    return this._valueId
  }
}

module.exports = BigCommerceCartLineItemPhysicalOption
