/**
 * Created by paul on 7/25/17.
 */

const { bns } = require('../lib/index.js')

const assert = require('assert')

describe('add', function () {
  it('32 + 10 = 42', function () {
    assert.equal(bns.add('32', '10'), '42')
  })
  it('very big num', function () {
    assert.equal(bns.add('1234000000000000000000000000000000001234', '4321000000000000000000000000000000004321'), '5555000000000000000000000000000000005555')
  })
  it('0x100 + 10 = 266', function () {
    assert.equal(bns.add('0x100', '10'), '266')
  })
  it('0x100 + 0x10 = 272', function () {
    assert.equal(bns.add('0x100', '0x10'), '272')
  })
  it('0x100 + -0x10 = 240', function () {
    assert.equal(bns.add('0x100', '-0x10'), '240')
  })
  it('0x100 + 0x10 = 0x110', function () {
    assert.equal(bns.add('0x100', '0x10', 16), '0x110')
  })
  it('32.01 + 10.2 = 42.21', function () {
    assert.equal(bns.add('32.01', '10.2'), '42.21')
  })
  it('very big float', function () {
    assert.equal(bns.add('100000.1234000000000000000000000000000000001234', '4321000000000000000000000000000000004321.000001'), '4321000000000000000000000000000000104321.1234010000000000000000000000000000001234')
  })
  it('very big negative float', function () {
    assert.equal(bns.add('1000000000000000001.9876000000000000000000000000000000009876', '-001.4321000000000000000000000000000000004321'), '1000000000000000000.5555000000000000000000000000000000005555')
  })
})

describe('sub', function () {
  it('32 - 10 = 22', function () {
    assert.equal(bns.sub('32', '10'), '22')
  })
  it('very big num', function () {
    assert.equal(bns.sub('9876000000000000000000000000000000009876', '4321000000000000000000000000000000004321'), '5555000000000000000000000000000000005555')
  })
  it('0x100 1 10 = 246', function () {
    assert.equal(bns.sub('0x100', '10'), '246')
  })
  it('0x100 - 0x10 = 240', function () {
    assert.equal(bns.sub('0x100', '0x10'), '240')
  })
  it('0x100 - -0x10 = 272', function () {
    assert.equal(bns.sub('0x100', '-0x10'), '272')
  })
  it('0x100 - 0x10 = 0xf0', function () {
    assert.equal(bns.sub('0x100', '0x10', 16), '0xf0')
  })
  it('32.01 - 10.2 = 21.81', function () {
    assert.equal(bns.sub('32.01', '10.2'), '21.81')
  })
  it('very big float', function () {
    assert.equal(bns.sub('1000000000000000001.9876000000000000000000000000000000009876', '001.4321000000000000000000000000000000004321'), '1000000000000000000.5555000000000000000000000000000000005555')
  })
})

describe('mul', function () {
  it('4 * 5 = 20', function () {
    assert.equal(bns.mul('4', '5'), '20')
  })
  it('very big num', function () {
    assert.equal(bns.mul('400000000000000000000000000', '5'), '2000000000000000000000000000')
  })
  it('very small num', function () {
    assert.equal(bns.mul('1234567890123456.123', '.00000000000000000000001'), '0.00000001234567890123456123')
  })
})

describe('div', function () {
  it('20 / 5 = 4', function () {
    assert.equal(bns.div('20', '5'), '4')
  })
  it('20.0 / 5.0 = 4', function () {
    assert.equal(bns.div('20.0', '5.0'), '4')
  })
  it('20.0 / 5 = 4', function () {
    assert.equal(bns.div('20.0', '5'), '4')
  })
  it('20 / 5.0 = 4', function () {
    assert.equal(bns.div('20', '5.0'), '4')
  })
  it('10 / 3 = 3', function () {
    assert.equal(bns.div('10', '3'), '3')
  })
  it('10 / 3 = 3.33333 (precision 5)', function () {
    assert.equal(bns.div('10', '3', 10, 5), '3.33333')
  })
  it('very big num', function () {
    assert.equal(bns.div('400000000000000000000000000', '5'), '80000000000000000000000000')
  })
  it('very big float', function () {
    assert.equal(bns.div('800000000000000000000000000.0000000000000000008', '2'), '400000000000000000000000000')
  })
  it('very big float (precision 9)', function () {
    assert.equal(bns.div('800000000000000000000000000.000000008', '2', 10, 9), '400000000000000000000000000.000000004')
  })
  it('very small num', function () {
    assert.equal(bns.div('1234567890123456.123', '.00000000000000000000001'), '123456789012345612300000000000000000000')
  })
})

describe('less than', function () {
  it('15 < 20 = True', function () {
    assert.equal(bns.lt('15', '20'), true)
  })
  it('20 < 15 = False', function () {
    assert.equal(bns.lt('20', '15'), false)
  })
  it('20 < 20 = False', function () {
    assert.equal(bns.lt('20', '20'), false)
  })
  it('Big num true', function () {
    assert.equal(bns.lt('4321000000000000000000000000000000004320', '4321000000000000000000000000000000004321'), true)
  })
  it('Big num false', function () {
    assert.equal(bns.lt('4321000000000000000000000000000000004322', '4321000000000000000000000000000000004321'), false)
  })
  it('Big num eq false', function () {
    assert.equal(bns.lt('4321000000000000000000000000000000004322', '4321000000000000000000000000000000004322'), false)
  })
  it('Big float true', function () {
    assert.equal(bns.lt('1.004321000000000000000000000000000000004320', '1.004321000000000000000000000000000000004321'), true)
  })
  it('Big float false', function () {
    assert.equal(bns.lt('10000000000000000.4321000000000000000000000000000000004322', '10000000000000000.4321000000000000000000000000000000004321'), false)
  })
  it('Big float eq false', function () {
    assert.equal(bns.lt('1234.4321000000000000000000000000000000004322', '0000001234.43210000000000000000000000000000000043220000'), false)
  })
})

describe('greater than', function () {
  it('15 > 20 = false', function () {
    assert.equal(bns.gt('15', '20'), false)
  })
  it('20 > 15 = true', function () {
    assert.equal(bns.gt('20', '15'), true)
  })
  it('20 > 20 = false', function () {
    assert.equal(bns.gt('20', '20'), false)
  })
  it('Big num false', function () {
    assert.equal(bns.gt('4321000000000000000000000000000000004320', '4321000000000000000000000000000000004321'), false)
  })
  it('Big num true', function () {
    assert.equal(bns.gt('4321000000000000000000000000000000004322', '4321000000000000000000000000000000004321'), true)
  })
  it('Big num eq false', function () {
    assert.equal(bns.gt('4321000000000000000000000000000000004322', '4321000000000000000000000000000000004322'), false)
  })
  it('Big float eq false', function () {
    assert.equal(bns.gt('1234.4321000000000000000000000000000000004322', '0000001234.43210000000000000000000000000000000043220000'), false)
  })
  it('Big float true', function () {
    assert.equal(bns.gt('1234.4321000000000000000001000000000000004322', '0000001234.43210000000000000000000000000000000043220000'), true)
  })
  it('Big float false', function () {
    assert.equal(bns.gt('1234.4321000000000000000000000000000000004322', '0000001234.43210000000000000000000000000000000043220001'), false)
  })
})

describe('less than equal', function () {
  it('15 <= 20 = True', function () {
    assert.equal(bns.lte('15', '20'), true)
  })
  it('20 <= 15 = False', function () {
    assert.equal(bns.lte('20', '15'), false)
  })
  it('20 <= 20 = true', function () {
    assert.equal(bns.lte('20', '20'), true)
  })
  it('Big num true', function () {
    assert.equal(bns.lte('4321000000000000000000000000000000004320', '4321000000000000000000000000000000004321'), true)
  })
  it('Big num false', function () {
    assert.equal(bns.lte('4321000000000000000000000000000000004322', '4321000000000000000000000000000000004321'), false)
  })
  it('Big num eq true', function () {
    assert.equal(bns.lte('4321000000000000000000000000000000004322', '4321000000000000000000000000000000004322'), true)
  })
  it('Big float eq true', function () {
    assert.equal(bns.lte('1234.4321000000000000000000000000000000004322', '0000001234.43210000000000000000000000000000000043220000'), true)
  })
  it('Big float false', function () {
    assert.equal(bns.lte('1234.4321000000000000000001000000000000004322', '0000001234.43210000000000000000000000000000000043220000'), false)
  })
  it('Big float true', function () {
    assert.equal(bns.lte('1234.4321000000000000000000000000000000004322', '0000001234.43210000000000000000000000000000000043220001'), true)
  })
})

describe('greater than equal', function () {
  it('15 >= 20 = false', function () {
    assert.equal(bns.gte('15', '20'), false)
  })
  it('20 >= 15 = true', function () {
    assert.equal(bns.gte('20', '15'), true)
  })
  it('20 >= 20 = true', function () {
    assert.equal(bns.gte('20', '15'), true)
  })
  it('Big num false', function () {
    assert.equal(bns.gte('4321000000000000000000000000000000004320', '4321000000000000000000000000000000004321'), false)
  })
  it('Big num true', function () {
    assert.equal(bns.gte('4321000000000000000000000000000000004322', '4321000000000000000000000000000000004321'), true)
  })
  it('Big num eq true', function () {
    assert.equal(bns.gte('4321000000000000000000000000000000004322', '4321000000000000000000000000000000004322'), true)
  })
  it('Big float eq true', function () {
    assert.equal(bns.gte('1234.4321000000000000000000000000000000004322', '0000001234.43210000000000000000000000000000000043220000'), true)
  })
  it('Big float true', function () {
    assert.equal(bns.gte('1234.4321000000000000000001000000000000004322', '0000001234.43210000000000000000000000000000000043220000'), true)
  })
  it('Big float false', function () {
    assert.equal(bns.gte('1234.4321000000000000000000000000000000004322', '0000001234.43210000000000000000000000000000000043220001'), false)
  })
})

describe('equal', function () {
  it('15 == 20 = false', function () {
    assert.equal(bns.eq('15', '20'), false)
  })
  it('20 == 15 = false', function () {
    assert.equal(bns.eq('20', '15'), false)
  })
  it('20 == 20 = true', function () {
    assert.equal(bns.eq('20', '20'), true)
  })
  it('00020 == 20 = true', function () {
    assert.equal(bns.eq('00020', '20'), true)
  })
  it('00020 == 20.000 = true', function () {
    assert.equal(bns.eq('00020', '20.000'), true)
  })
  it('00020.000000001 == 20.000 = false', function () {
    assert.equal(bns.eq('00020.000000001', '20.000'), false)
  })
  it('123456789.12345 == 0x1001 => Error', function () {
    assert.throws(() => {
      bns.eq('123456789.12345', '0x1001')
    })
  })

})

describe('max', function () {
  it('max(100, 1000) => 1000', function () {
    assert.equal(bns.max('100', '1000'), '1000')
  })
  it('max(2000, 100) => 2000', function () {
    assert.equal(bns.max('2000', '100'), '2000')
  })
  it('max(3000, 3000) => 3000', function () {
    assert.equal(bns.max('3000', '3000'), '3000')
  })
  it('max(0x100, 255) => 256', function () {
    assert.equal(bns.max('0x100', '255'), '256')
  })
  it('max(255, 0x100) => 256', function () {
    assert.equal(bns.max('255', '0x100'), '256')
  })
  it('max(257, 0x100, 16) => 0x101', function () {
    assert.equal(bns.max('257', '0x100', 16), '0x101')
  })
  it('very big num', function () {
    assert.equal(bns.max('9876000000000000000000000000000000000002', '9876000000000000000000000000000000000001'), '9876000000000000000000000000000000000002')
  })
  it('max(100.001, 1000.0) => 1000', function () {
    assert.equal(bns.max('100.001', '1000'), '1000')
  })
  it('max(100123.001, 1000.01) => 1000', function () {
    assert.equal(bns.max('100123.001', '1000.01'), '100123.001')
  })
})

describe('min', function () {
  it('min(100, 1000) => 100', function () {
    assert.equal(bns.min('100', '1000'), '100')
  })
  it('min(2000, 100) => 100', function () {
    assert.equal(bns.min('1000', '100'), '100')
  })
  it('min(3000, 3000) => 3000', function () {
    assert.equal(bns.min('3000', '3000'), '3000')
  })
  it('min(0x100, 255) => 255', function () {
    assert.equal(bns.min('0x100', '255'), '255')
  })
  it('min(255, 0x100) => 255', function () {
    assert.equal(bns.min('255', '0x100'), '255')
  })
  it('min(257, 0x100, 16) => 0x100', function () {
    assert.equal(bns.min('257', '0x100', 16), '0x100')
  })
  it('very big num', function () {
    assert.equal(bns.min('9876000000000000000000000000000000000002', '9876000000000000000000000000000000000001'), '9876000000000000000000000000000000000001')
  })
  it('min(100.001, 1000.0) => 1000', function () {
    assert.equal(bns.min('100.001', '1000'), '100.001')
  })
  it('min(100123.001, 1000.01) => 1000', function () {
    assert.equal(bns.min('100123.001', '1000.01'), '1000.01')
  })
})

describe('abs', function () {
  it('abs("1") => "1")', function () {
    assert.equal(bns.abs('1'), '1')
  })
  it('abs("-1") => "1")', function () {
    assert.equal(bns.abs('-1'), '1')
  })
  it('abs("-1.123") => "1.123")', function () {
    assert.equal(bns.abs('-1.123'), '1.123')
  })
  it('abs("-.123456789012345") => "0.123456789012345")', function () {
    assert.equal(bns.abs('-.123456789012345'), '0.123456789012345')
  })
  it('abs(".123456789012345") => "0.123456789012345")', function () {
    assert.equal(bns.abs('.123456789012345'), '0.123456789012345')
  })
  it('abs("-0x11") => "17")', function () {
    assert.equal(bns.abs('-0x11'), '17')
  })
  it('abs("-0x11", 16) => "0x11")', function () {
    assert.equal(bns.abs('-0x11', 16), '0x11')
  })
})

describe('toFixed', function () {
  it('toFixed("100", 2) => 100.00', function () {
    assert.equal(bns.toFixed('100', 2), '100.00')
  })
  it('toFixed("100.123", 2) => 100.12', function () {
    assert.equal(bns.toFixed('100.123', 2), '100.123')
  })
  it('toFixed("00100.123", 2) => 100.12', function () {
    assert.equal(bns.toFixed('100.123', 2), '100.123')
  })
  it('toFixed("00100.12300", 2) => 100.12', function () {
    assert.equal(bns.toFixed('100.123', 2), '100.123')
  })
  it('toFixed("00100.12300", 2) => 100.12', function () {
    assert.equal(bns.toFixed('100.1', 2), '100.10')
  })
  it('toFixed("00100", 5) => 100.00000', function () {
    assert.equal(bns.toFixed('00100', 5), '100.00000')
  })
  it('toFixed("00100.12345678", 5, 7) => 100.12345678', function () {
    assert.equal(bns.toFixed('00100.12345678', 5, 7), '100.1234567')
  })
  it('toFixed("00100.12345678", 5, 8) => 100.1234568', function () {
    assert.equal(bns.toFixed('00100.12345678', 5, 8), '100.12345678')
  })
  it('toFixed("00100.12345678", 5, 6) => 100.123456', function () {
    assert.equal(bns.toFixed('00100.12345678', 5, 6), '100.123456')
  })
  it('toFixed("1.0", 1, 6) => "1.0"', function () {
    assert.equal(bns.toFixed('1.0', 1, 6), '1.0')
  })
  it('toFixed("0", 0, 6) => "0"', function () {
    assert.equal(bns.toFixed('0', 0, 6), '0')
  })
  it('toFixed("00", 0, 6) => "0"', function () {
    assert.equal(bns.toFixed('00', 0, 6), '0')
  })
  it('toFixed("-1.0", 1, 6) => "-1.0"', function () {
    assert.equal(bns.toFixed('-1.0', 1, 6), '-1.0')
  })
  it('toFixed("-00100.12345678", 5, 6) => -100.123456', function () {
    assert.equal(bns.toFixed('-00100.12345678', 5, 6), '-100.123456')
  })
})

describe('log10', function () {
  it('100 => 2', function () {
    assert.equal(bns.log10('100'), 2)
  })
  it('100000000000000000000 => 20', function () {
    assert.equal(bns.log10('100000000000000000000'), 20)
  })
  it('100000000000000001000 => Error', function () {
    assert.throws(() => {
      bns.log10('100000000000000001000')
    })
  })
  it('3000000000000000000 => Error', function () {
    assert.throws(() => {
      bns.log10('3000000000000000000')
    })
  })
  it('00100000000000000001000 => Error', function () {
    assert.throws(() => {
      bns.log10('00100000000000000001000')
    })
  })
})

