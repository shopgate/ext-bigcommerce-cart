'use strict'
const assert = require('assert')
const {describe, it, beforeEach} = require('mocha')
const IdentifierConverter = require('../../../lib/shopgate/IdentifierConverter')

describe('CartExtensionPipeline - unit', () => {
  /** @type IdentifierConverter */
  let subjectUnderTest

  beforeEach(() => {
    subjectUnderTest = new IdentifierConverter()
  })

  describe('extractProductIds', () => {
    it('should extract a variantId', function () {
      return assert.deepEqual(subjectUnderTest.extractProductIds('123-321'), {productId: 123, variantId: 321})
    })

    it('should be able to handle productId only', function () {
      return assert.deepEqual(subjectUnderTest.extractProductIds('123'), {productId: 123, variantId: null})
    })

    it('should be able to handle productId number as well', function () {
      return assert.deepEqual(subjectUnderTest.extractProductIds(123), {productId: 123, variantId: null})
    })
  })
})
