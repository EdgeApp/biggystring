/**
 * Created by paul on 7/25/17.
 */

const bs = require('../lib/index.js')
const assert = require('assert')

describe('add', function () {
  it('32 + 10 = 42', function () {
    assert.equal(bs.add('32', '10'), '42')
  })
  it('very big num', function () {
    assert.equal(bs.add('1234000000000000000000000000000000001234', '4321000000000000000000000000000000004321'), '5555000000000000000000000000000000005555')
  })
  it('0x100 + 10 = 266', function () {
    assert.equal(bs.add('0x100', '10'), '266')
  })
  it('0x100 + 0x10 = 272', function () {
    assert.equal(bs.add('0x100', '0x10'), '272')
  })
  it('0x100 + 0x10 = 0x110', function () {
    assert.equal(bs.add('0x100', '0x10', 16), '0x110')
  })
})

describe('sub', function () {
  it('32 - 10 = 22', function () {
    assert.equal(bs.sub('32', '10'), '22')
  })
  it('very big num', function () {
    assert.equal(bs.sub('9876000000000000000000000000000000009876', '4321000000000000000000000000000000004321'), '5555000000000000000000000000000000005555')
  })
  it('0x100 1 10 = 246', function () {
    assert.equal(bs.sub('0x100', '10'), '246')
  })
  it('0x100 - 0x10 = 272', function () {
    assert.equal(bs.sub('0x100', '0x10'), '240')
  })
  it('0x100 - 0x10 = 0xf0', function () {
    assert.equal(bs.sub('0x100', '0x10', 16), '0xf0')
  })
})

describe('fixedToInt', function () {
  it('123456789.12345 12 => 12345671234500000', function () {
    assert.equal(bs.fixedToInt('123456789.12345', 12), '123456789123450000000')
  })
  it('123456789.12345 3 => Error', function () {
    assert.throws(() => {
      bs.fixedToInt('123456789.12345', 3)
    })
  })
})

describe('intToFixed', function () {
  it('12345678 12 => .000012345678', function () {
    assert.equal(bs.intToFixed('12345678', 12), .000012345678)
  })
  it('12345678 8 => .12345678', function () {
    assert.equal(bs.intToFixed('12345678', 8), .12345678)
  })
  it('12345678 4 => 1234.5678', function () {
    assert.equal(bs.intToFixed('12345678', 4), 1234.5678)
  })
  it('123456789123456789 8 => 1234567891.23456789', function () {
    assert.equal(bs.intToFixed('123456789123456789', 8), 1234567891.23456789)
  })
  it('123456789123456789 12 => 123456.7891234567', function () {
    assert.equal(bs.intToFixed('123456789123456789', 12), 123456.7891234567)
  })
})