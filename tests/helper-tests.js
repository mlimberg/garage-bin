const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const sortABC = require('../src/helpers').sortABC
const sortCBA = require('../src/helpers').sortCBA

describe('HELPERS', () => {
  it('should have a sortABC function', () => {
    assert.isFunction(sortABC)
  })

  it('should have a sortCBA function', () => {
    assert.isFunction(sortCBA)
  })

  it('sortABC should sort alphabetically', () => {
    let sample = [{name: 'c'}, {name: 'a'}, {name: 'b'}]
    assert.deepEqual(sortABC(sample), [{name: 'a'}, {name: 'b'}, {name: 'c'}])
  })

  it('sortBCA should sort reverse-alphabetically', () => {
    let sample = [{name: 'a'}, {name: 'c'}, {name: 'b'}]
    assert.deepEqual(sortCBA(sample), [{name: 'c'}, {name: 'b'}, {name: 'a'}])
  })
})
