'use strict'

const chai = require('chai')
const IdentifierConverter = require('../../../lib/shopgate/IdentifierConverter')

describe('CartExtensionPipeline - unit', () => {
  describe('extractProductIds', () => {
    it('should extract a variantId', () => {
      chai.assert.deepStrictEqual(IdentifierConverter.extractProductIds('123-321'), {productId: 123, variantId: 321})
    })

    it('should be able to handle productId only', () => {
      chai.assert.deepStrictEqual(IdentifierConverter.extractProductIds('123'), {productId: 123, variantId: null})
    })

    it('should be able to handle productId number as well', () => {
      chai.assert.deepStrictEqual(IdentifierConverter.extractProductIds(123), {productId: 123, variantId: null})
    })
  })

  describe('joinProductIds', () => {
    it('should return productId if variantId is empty', () => {
      chai.assert.deepStrictEqual(IdentifierConverter.joinProductIds(123), 123)
      chai.assert.deepStrictEqual(IdentifierConverter.joinProductIds('123'), '123')
      chai.assert.deepStrictEqual(IdentifierConverter.joinProductIds('123', undefined), '123')
      chai.assert.deepStrictEqual(IdentifierConverter.joinProductIds('123', null), '123')
      chai.assert.deepStrictEqual(IdentifierConverter.joinProductIds('123', ''), '123')
    })

    it('should concatenate productId + variantId with a dash in between if the latter is not empty', () => {
      chai.assert.deepStrictEqual(IdentifierConverter.joinProductIds('123', '456'), '123-456')
      chai.assert.deepStrictEqual(IdentifierConverter.joinProductIds('123', 456), '123-456')
      chai.assert.deepStrictEqual(IdentifierConverter.joinProductIds(123, '456'), '123-456')
      chai.assert.deepStrictEqual(IdentifierConverter.joinProductIds(123, 456), '123-456')
      chai.assert.deepStrictEqual(IdentifierConverter.joinProductIds(123, 0), '123-0')
    })
  })
})
