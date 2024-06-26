/**
 * Created by paul on 7/25/17.
 */

import { assert } from 'chai'

import {
  abs,
  add,
  ceil,
  div,
  eq,
  floor,
  gt,
  gte,
  log10,
  lt,
  lte,
  max,
  min,
  mul,
  round,
  sub,
  toBns,
  toFixed,
} from '../src/index'

describe('add', function () {
  it('32 + 10 = 42', function () {
    assert.equal(add('32', '10'), '42')
  })
  it('very big num', function () {
    assert.equal(
      add(
        '1234000000000000000000000000000000001234',
        '4321000000000000000000000000000000004321'
      ),
      '5555000000000000000000000000000000005555'
    )
  })
  it('0x100 + 10 = 266', function () {
    assert.equal(add('0x100', '10'), '266')
  })
  it('0x100 + 0x10 = 272', function () {
    assert.equal(add('0x100', '0x10'), '272')
  })
  it('0x100 + -0x10 = 240', function () {
    assert.equal(add('0x100', '-0x10'), '240')
  })
  it('0x100 + 0x10 = 0x110', function () {
    assert.equal(add('0x100', '0x10', 16), '0x110')
  })
  it('32.01 + 10.2 = 42.21', function () {
    assert.equal(add('32.01', '10.2'), '42.21')
  })
  it('very big float', function () {
    assert.equal(
      add(
        '100000.1234000000000000000000000000000000001234',
        '4321000000000000000000000000000000004321.000001'
      ),
      '4321000000000000000000000000000000104321.1234010000000000000000000000000000001234'
    )
  })
  it('very big negative float', function () {
    assert.equal(
      add(
        '1000000000000000001.9876000000000000000000000000000000009876',
        '-001.4321000000000000000000000000000000004321'
      ),
      '1000000000000000000.5555000000000000000000000000000000005555'
    )
  })
  it('resolve negative numbers in base 16', function () {
    assert.equal(add('-60830', '0', 16), '-0xed9e')
  })
  it('add with spaces', function () {
    assert.equal(add(' -2 ', '    '), '-2')
  })
  it('add with bad spaces', function () {
    assert.throws(() => add(' -2 1 ', '    '))
  })
})

describe('sub', function () {
  it('32 - 10 = 22', function () {
    assert.equal(sub('32', '10'), '22')
  })
  it('very big num', function () {
    assert.equal(
      sub(
        '9876000000000000000000000000000000009876',
        '4321000000000000000000000000000000004321'
      ),
      '5555000000000000000000000000000000005555'
    )
  })
  it('0x100 1 10 = 246', function () {
    assert.equal(sub('0x100', '10'), '246')
  })
  it('0x100 - 0x10 = 240', function () {
    assert.equal(sub('0x100', '0x10'), '240')
  })
  it('0x100 - -0x10 = 272', function () {
    assert.equal(sub('0x100', '-0x10'), '272')
  })
  it('0x100 - 0x10 = 0xf0', function () {
    assert.equal(sub('0x100', '0x10', 16), '0xf0')
  })
  it('32.01 - 10.2 = 21.81', function () {
    assert.equal(sub('32.01', '10.2'), '21.81')
  })
  it('very big float', function () {
    assert.equal(
      sub(
        '1000000000000000001.9876000000000000000000000000000000009876',
        '001.4321000000000000000000000000000000004321'
      ),
      '1000000000000000000.5555000000000000000000000000000000005555'
    )
  })
  it('resolve negative numbers in base 16', function () {
    assert.equal(sub('-60830', '0', 16), '-0xed9e')
  })
})

describe('mul', function () {
  it('4 * 5 = 20', function () {
    assert.equal(mul('4', '5'), '20')
  })
  it('very big num', function () {
    assert.equal(
      mul('400000000000000000000000000', '5'),
      '2000000000000000000000000000'
    )
  })
  it('very small num', function () {
    assert.equal(
      mul('1234567890123456.123', '.00000000000000000000001'),
      '0.00000001234567890123456123'
    )
  })
  it('resolve negative numbers in base 16', function () {
    assert.equal(mul('-60830', '1', 16), '-0xed9e')
  })
})

describe('div', function () {
  it('-411 / 100000 = -0.00411', function () {
    assert.equal(div('-411', '100000', 18), '-0.00411')
  })
  it('20 / 5 = 4', function () {
    assert.equal(div('20', '5'), '4')
  })
  it('20.0 / 5.0 = 4', function () {
    assert.equal(div('20.0', '5.0'), '4')
  })
  it('20.0 / 5 = 4', function () {
    assert.equal(div('20.0', '5'), '4')
  })
  it('20 / 5.0 = 4', function () {
    assert.equal(div('20', '5.0'), '4')
  })
  it('10 / 3 = 3', function () {
    assert.equal(div('10', '3'), '3')
  })
  it('10 / 3 = 3.33333 (precision 5)', function () {
    assert.equal(div('10', '3', 5), '3.33333')
  })
  it('very big num', function () {
    assert.equal(
      div('400000000000000000000000000', '5'),
      '80000000000000000000000000'
    )
  })
  it('very big float', function () {
    assert.equal(
      div('800000000000000000000000000.0000000000000000008', '2'),
      '400000000000000000000000000'
    )
  })
  it('very big float (precision 9, base 10)', function () {
    assert.equal(
      div('800000000000000000000000000.000000008', '2', 9, 10),
      '400000000000000000000000000.000000004'
    )
  })
  it('very small num', function () {
    assert.equal(
      div('1234567890123456.123', '.00000000000000000000001'),
      '123456789012345612300000000000000000000'
    )
  })
  it('Check error with hex output', function () {
    assert.throws(() => {
      div('10', '3', 5, 16)
    })
  })
  it('resolve negative numbers in base 16', function () {
    assert.equal(div('-60830', '1', 0, 16), '-0xed9e')
  })
})

describe('toBns', function () {
  it('regular number', function () {
    assert.equal(toBns(123), '123')
  })
  it('string number with spaces', function () {
    assert.equal(toBns(' 123 '), '123')
  })
  it('spaces', function () {
    assert.equal(toBns(' '), '')
  })
  it('2 spaces', function () {
    assert.equal(toBns('  '), '')
  })
  it('scientific notation: regular numbers', function () {
    const numStr = '5e0'
    assert.equal(toBns(numStr), '5')
  })
  it('scientific notation: big integer base', function () {
    const big = 3000000000000000000000
    const bigStr = big.toString()
    assert.equal(bigStr, '3e+21')
    assert.equal(toBns(big), '3000000000000000000000')
    assert.equal(toBns(bigStr), '3000000000000000000000')
  })
  it('scientific notation: small integer base', function () {
    const small = 0.000000000000000000003
    const smallStr = small.toString()
    assert.equal(smallStr, '3e-21')
    assert.equal(toBns(small), '0.000000000000000000003')
    assert.equal(toBns(smallStr), '0.000000000000000000003')
  })
  it('scientific notation: big negative base', function () {
    const big = -3000000000000000000000
    const bigStr = big.toString()
    assert.equal(bigStr, '-3e+21')
    assert.equal(toBns(big), '-3000000000000000000000')
    assert.equal(toBns(bigStr), '-3000000000000000000000')
  })
  it('scientific notation: small negative base', function () {
    const small = -0.000000000000000000003
    const smallStr = small.toString()
    assert(smallStr, '-3e-21')
    assert.equal(toBns(small), '-0.000000000000000000003')
    assert.equal(toBns(smallStr), '-0.000000000000000000003')
  })
  it('scientific notation: big decimal base', function () {
    const decimal = 312000000000000000000000
    const decimalStr = decimal.toString()
    assert.equal(decimalStr, '3.12e+23')
    assert.equal(toBns(decimal), '312000000000000000000000')
    assert.equal(toBns(decimalStr), '312000000000000000000000')
  })
  it('scientific notation: small decimal base', function () {
    const small = 0.000000000000000000000312
    const smallStr = small.toString()
    assert(smallStr, '3.12e-23')
    assert.equal(toBns(small), '0.000000000000000000000312')
    assert.equal(toBns(smallStr), '0.000000000000000000000312')
  })
  it('scientific notation: big negative decimal base', function () {
    const small = -312000000000000000000000
    const smallStr = small.toString()
    assert(smallStr, '-3.12e+23')
    assert.equal(toBns(small), '-312000000000000000000000')
    assert.equal(toBns(smallStr), '-312000000000000000000000')
  })
  it('scientific notation: small negative decimal base', function () {
    const small = -0.000000000000000000000312
    const smallStr = small.toString()
    assert(smallStr, '-3.12e-23')
    assert.equal(toBns(small), '-0.000000000000000000000312')
    assert.equal(toBns(smallStr), '-0.000000000000000000000312')
  })
  it('scientific notation: long decimal base', function () {
    const longDecimalSciNo = '-1.2345678911121314151617181920e-12'
    assert.equal(
      toBns(longDecimalSciNo),
      '-0.000000000001234567891112131415161718192'
    )
  })
  it('scientific notation: invalid numbers', function () {
    assert.throws(
      () => toBns('3.2.0e12'),
      `Invalid number: more than one decimal point '3.2.0e12'`
    )
    assert.throws(
      () => toBns('3x0e12'),
      `Invalid number: non-number characters '3x0e12'`
    )
    assert.throws(
      () => toBns('3e1.2'),
      `Invalid number: non-number characters '3e1.2'`
    )
  })
})

describe('less than', function () {
  it('15 < 20 = True', function () {
    assert.equal(lt('15', '20'), true)
  })
  it('20 < 15 = False', function () {
    assert.equal(lt('20', '15'), false)
  })
  it('20 < 20 = False', function () {
    assert.equal(lt('20', '20'), false)
  })
  it('Big num true', function () {
    assert.equal(
      lt(
        '4321000000000000000000000000000000004320',
        '4321000000000000000000000000000000004321'
      ),
      true
    )
  })
  it('Big num false', function () {
    assert.equal(
      lt(
        '4321000000000000000000000000000000004322',
        '4321000000000000000000000000000000004321'
      ),
      false
    )
  })
  it('Big num eq false', function () {
    assert.equal(
      lt(
        '4321000000000000000000000000000000004322',
        '4321000000000000000000000000000000004322'
      ),
      false
    )
  })
  it('Big float true', function () {
    assert.equal(
      lt(
        '1.004321000000000000000000000000000000004320',
        '1.004321000000000000000000000000000000004321'
      ),
      true
    )
  })
  it('Big float false', function () {
    assert.equal(
      lt(
        '10000000000000000.4321000000000000000000000000000000004322',
        '10000000000000000.4321000000000000000000000000000000004321'
      ),
      false
    )
  })
  it('Big float eq false', function () {
    assert.equal(
      lt(
        '1234.4321000000000000000000000000000000004322',
        '0000001234.43210000000000000000000000000000000043220000'
      ),
      false
    )
  })
})

describe('greater than', function () {
  it('15 > 20 = false', function () {
    assert.equal(gt('15', '20'), false)
  })
  it('20 > 15 = true', function () {
    assert.equal(gt('20', '15'), true)
  })
  it('20 > 20 = false', function () {
    assert.equal(gt('20', '20'), false)
  })
  it('Big num false', function () {
    assert.equal(
      gt(
        '4321000000000000000000000000000000004320',
        '4321000000000000000000000000000000004321'
      ),
      false
    )
  })
  it('Big num true', function () {
    assert.equal(
      gt(
        '4321000000000000000000000000000000004322',
        '4321000000000000000000000000000000004321'
      ),
      true
    )
  })
  it('Big num eq false', function () {
    assert.equal(
      gt(
        '4321000000000000000000000000000000004322',
        '4321000000000000000000000000000000004322'
      ),
      false
    )
  })
  it('Big float eq false', function () {
    assert.equal(
      gt(
        '1234.4321000000000000000000000000000000004322',
        '0000001234.43210000000000000000000000000000000043220000'
      ),
      false
    )
  })
  it('Big float true', function () {
    assert.equal(
      gt(
        '1234.4321000000000000000001000000000000004322',
        '0000001234.43210000000000000000000000000000000043220000'
      ),
      true
    )
  })
  it('Big float false', function () {
    assert.equal(
      gt(
        '1234.4321000000000000000000000000000000004322',
        '0000001234.43210000000000000000000000000000000043220001'
      ),
      false
    )
  })
})

describe('less than equal', function () {
  it('15 <= 20 = True', function () {
    assert.equal(lte('15', '20'), true)
  })
  it('20 <= 15 = False', function () {
    assert.equal(lte('20', '15'), false)
  })
  it('20 <= 20 = true', function () {
    assert.equal(lte('20', '20'), true)
  })
  it('Big num true', function () {
    assert.equal(
      lte(
        '4321000000000000000000000000000000004320',
        '4321000000000000000000000000000000004321'
      ),
      true
    )
  })
  it('Big num false', function () {
    assert.equal(
      lte(
        '4321000000000000000000000000000000004322',
        '4321000000000000000000000000000000004321'
      ),
      false
    )
  })
  it('Big num eq true', function () {
    assert.equal(
      lte(
        '4321000000000000000000000000000000004322',
        '4321000000000000000000000000000000004322'
      ),
      true
    )
  })
  it('Big float eq true', function () {
    assert.equal(
      lte(
        '1234.4321000000000000000000000000000000004322',
        '0000001234.43210000000000000000000000000000000043220000'
      ),
      true
    )
  })
  it('Big float false', function () {
    assert.equal(
      lte(
        '1234.4321000000000000000001000000000000004322',
        '0000001234.43210000000000000000000000000000000043220000'
      ),
      false
    )
  })
  it('Big float true', function () {
    assert.equal(
      lte(
        '1234.4321000000000000000000000000000000004322',
        '0000001234.43210000000000000000000000000000000043220001'
      ),
      true
    )
  })
})

describe('greater than equal', function () {
  it('15 >= 20 = false', function () {
    assert.equal(gte('15', '20'), false)
  })
  it('20 >= 15 = true', function () {
    assert.equal(gte('20', '15'), true)
  })
  it('20 >= 20 = true', function () {
    assert.equal(gte('20', '15'), true)
  })
  it('Big num false', function () {
    assert.equal(
      gte(
        '4321000000000000000000000000000000004320',
        '4321000000000000000000000000000000004321'
      ),
      false
    )
  })
  it('Big num true', function () {
    assert.equal(
      gte(
        '4321000000000000000000000000000000004322',
        '4321000000000000000000000000000000004321'
      ),
      true
    )
  })
  it('Big num eq true', function () {
    assert.equal(
      gte(
        '4321000000000000000000000000000000004322',
        '4321000000000000000000000000000000004322'
      ),
      true
    )
  })
  it('Big float eq true', function () {
    assert.equal(
      gte(
        '1234.4321000000000000000000000000000000004322',
        '0000001234.43210000000000000000000000000000000043220000'
      ),
      true
    )
  })
  it('Big float true', function () {
    assert.equal(
      gte(
        '1234.4321000000000000000001000000000000004322',
        '0000001234.43210000000000000000000000000000000043220000'
      ),
      true
    )
  })
  it('Big float false', function () {
    assert.equal(
      gte(
        '1234.4321000000000000000000000000000000004322',
        '0000001234.43210000000000000000000000000000000043220001'
      ),
      false
    )
  })
})

describe('equal', function () {
  it('15 == 20 = false', function () {
    assert.equal(eq('15', '20'), false)
  })
  it('20 == 15 = false', function () {
    assert.equal(eq('20', '15'), false)
  })
  it('20 == 20 = true', function () {
    assert.equal(eq('20', '20'), true)
  })
  it('00020 == 20 = true', function () {
    assert.equal(eq('00020', '20'), true)
  })
  it('00020 == 20.000 = true', function () {
    assert.equal(eq('00020', '20.000'), true)
  })
  it('00020.000000001 == 20.000 = false', function () {
    assert.equal(eq('00020.000000001', '20.000'), false)
  })
  it('123456789.12345 == 0x1001 => Error', function () {
    assert.throws(() => {
      eq('123456789.12345', '0x1001')
    })
  })
})

describe('max', function () {
  it('max(100, 1000) => 1000', function () {
    assert.equal(max('100', '1000'), '1000')
  })
  it('max(2000, 100) => 2000', function () {
    assert.equal(max('2000', '100'), '2000')
  })
  it('max(3000, 3000) => 3000', function () {
    assert.equal(max('3000', '3000'), '3000')
  })
  it('max(0x100, 255) => 256', function () {
    assert.equal(max('0x100', '255'), '256')
  })
  it('max(255, 0x100) => 256', function () {
    assert.equal(max('255', '0x100'), '256')
  })
  it('max(257, 0x100, 16) => 0x101', function () {
    assert.equal(max('257', '0x100', 16), '0x101')
  })
  it('very big num', function () {
    assert.equal(
      max(
        '9876000000000000000000000000000000000002',
        '9876000000000000000000000000000000000001'
      ),
      '9876000000000000000000000000000000000002'
    )
  })
  it('max(100.001, 1000.0) => 1000', function () {
    assert.equal(max('100.001', '1000'), '1000')
  })
  it('max(100123.001, 1000.01) => 1000', function () {
    assert.equal(max('100123.001', '1000.01'), '100123.001')
  })
})

describe('min', function () {
  it('min(100, 1000) => 100', function () {
    assert.equal(min('100', '1000'), '100')
  })
  it('min(2000, 100) => 100', function () {
    assert.equal(min('1000', '100'), '100')
  })
  it('min(3000, 3000) => 3000', function () {
    assert.equal(min('3000', '3000'), '3000')
  })
  it('min(0x100, 255) => 255', function () {
    assert.equal(min('0x100', '255'), '255')
  })
  it('min(255, 0x100) => 255', function () {
    assert.equal(min('255', '0x100'), '255')
  })
  it('min(257, 0x100, 16) => 0x100', function () {
    assert.equal(min('257', '0x100', 16), '0x100')
  })
  it('very big num', function () {
    assert.equal(
      min(
        '9876000000000000000000000000000000000002',
        '9876000000000000000000000000000000000001'
      ),
      '9876000000000000000000000000000000000001'
    )
  })
  it('min(100.001, 1000.0) => 1000', function () {
    assert.equal(min('100.001', '1000'), '100.001')
  })
  it('min(100123.001, 1000.01) => 1000', function () {
    assert.equal(min('100123.001', '1000.01'), '1000.01')
  })
})

describe('abs', function () {
  it('abs("1") => "1")', function () {
    assert.equal(abs('1'), '1')
  })
  it('abs("-1") => "1")', function () {
    assert.equal(abs('-1'), '1')
  })
  it('abs("-1.123") => "1.123")', function () {
    assert.equal(abs('-1.123'), '1.123')
  })
  it('abs("-.123456789012345") => "0.123456789012345")', function () {
    assert.equal(abs('-.123456789012345'), '0.123456789012345')
  })
  it('abs(".123456789012345") => "0.123456789012345")', function () {
    assert.equal(abs('.123456789012345'), '0.123456789012345')
  })
  it('abs("-0x11") => "17")', function () {
    assert.equal(abs('-0x11'), '17')
  })
  it('abs("-0x11", 16) => "0x11")', function () {
    assert.equal(abs('-0x11', 16), '0x11')
  })
})

describe('toFixed', function () {
  it('toFixed("100", 2) => 100.00', function () {
    assert.equal(toFixed('100', 2), '100.00')
  })
  it('toFixed("100.123", 2) => 100.12', function () {
    assert.equal(toFixed('100.123', 2), '100.123')
  })
  it('toFixed("00100.123", 2) => 100.12', function () {
    assert.equal(toFixed('100.123', 2), '100.123')
  })
  it('toFixed("00100.12300", 2) => 100.12', function () {
    assert.equal(toFixed('100.123', 2), '100.123')
  })
  it('toFixed("00100.12300", 2) => 100.12', function () {
    assert.equal(toFixed('100.1', 2), '100.10')
  })
  it('toFixed("00100", 5) => 100.00000', function () {
    assert.equal(toFixed('00100', 5), '100.00000')
  })
  it('toFixed("00100.12345678", 5, 7) => 100.12345678', function () {
    assert.equal(toFixed('00100.12345678', 5, 7), '100.1234567')
  })
  it('toFixed("00100.12345678", 5, 8) => 100.1234568', function () {
    assert.equal(toFixed('00100.12345678', 5, 8), '100.12345678')
  })
  it('toFixed("00100.12345678", 5, 6) => 100.123456', function () {
    assert.equal(toFixed('00100.12345678', 5, 6), '100.123456')
  })
  it('toFixed("1.0", 1, 6) => "1.0"', function () {
    assert.equal(toFixed('1.0', 1, 6), '1.0')
  })
  it('toFixed("0", 0, 6) => "0"', function () {
    assert.equal(toFixed('0', 0, 6), '0')
  })
  it('toFixed("00", 0, 6) => "0"', function () {
    assert.equal(toFixed('00', 0, 6), '0')
  })
  it('toFixed("-1.0", 1, 6) => "-1.0"', function () {
    assert.equal(toFixed('-1.0', 1, 6), '-1.0')
  })
  it('toFixed("-00100.12345678", 5, 6) => -100.123456', function () {
    assert.equal(toFixed('-00100.12345678', 5, 6), '-100.123456')
  })
  it('toFixed("-00100.12345678", 0, 0) => -100', function () {
    assert.equal(toFixed('-00100.12345678', 0, 0), '-100')
  })
})

describe('log10', function () {
  it('100 => 2', function () {
    assert.equal(log10('100'), 2)
  })
  it('100000000000000000000 => 20', function () {
    assert.equal(log10('100000000000000000000'), 20)
  })
  it('100000000000000001000 => Error', function () {
    assert.throws(() => {
      log10('100000000000000001000')
    })
  })
  it('3000000000000000000 => Error', function () {
    assert.throws(() => {
      log10('3000000000000000000')
    })
  })
  it('00100000000000000001000 => Error', function () {
    assert.throws(() => {
      log10('00100000000000000001000')
    })
  })
})

describe('round', () => {
  it('-0.06234 -1 => -0.1', () => {
    assert.equal(round('-0.06234', -1), '-0.1')
  })
  it('-0.006234 -5 => -0.00623', () => {
    assert.equal(round('-0.006234', -5), '-0.00623')
  })
  it('-0.006237 -5 => -0.00624', () => {
    assert.equal(round('-0.006237', -5), '-0.00624')
  })
  it('0.006237 -5 => 0.00624', () => {
    assert.equal(round('0.006237', -5), '0.00624')
  })
  it('-0.1234 0 => 0', () => {
    assert.equal(round('-0.1234', 0), '0')
  })
  it('-12345.678 8 => 0', () => {
    assert.equal(round('-12345.678', 8), '0')
  })
  it('-62345.678 8 => 0', () => {
    assert.equal(round('-62345.678', 8), '0')
  })
  it('-62345.678 5 => -100000', () => {
    assert.equal(round('-62345.678', 5), '-100000')
  })
  it('-12345.678 5 => 0', () => {
    assert.equal(round('-12345.678', 5), '0')
  })
  it('-12345.678 -6 => -12345.678', () => {
    assert.equal(round('-12345.678', -6), '-12345.678')
  })
  it('-12345.678 -3 => -12345.678', () => {
    assert.equal(round('-12345.678', -3), '-12345.678')
  })
  it('12000 3 => 12000', () => {
    assert.equal(round('12000', -3), '12000')
  })
  it('12345.678 -3 => 12345.678', () => {
    assert.equal(round('12345.678', -3), '12345.678')
  })

  it('12345.648 -1 => 12345.6', () => {
    assert.equal(round('12345.648', -1), '12345.6')
  })
  it('12345.678 -1 => 12345.7', () => {
    assert.equal(round('12345.678', -1), '12345.7')
  })
  it('12345.678 0 => 12346', () => {
    assert.equal(round('12345.678', 0), '12346')
  })
  it('12345.678 2 => 12300', () => {
    assert.equal(round('12345.678', 2), '12300')
  })
  it('12345.000 2 => 12300', () => {
    assert.equal(round('12345.000', 2), '12300')
  })

  it('19965 2 => 20000', () => {
    assert.equal(round('19965', 2), '20000')
  })
  it('19945 2 => 19900', () => {
    assert.equal(round('19945', 2), '19900')
  })
  it('12355 2 => 12400', () => {
    assert.equal(round('12355', 2), '12400')
  })
  it('12345 2 => 12300', () => {
    assert.equal(round('12345', 2), '12300')
  })
  it('0.000058196685058537 -8 => 0.0000582', () => {
    assert.equal(round('0.000058196685058537', -8), '0.0000582')
  })
})

describe('ceil', () => {
  it('-0.006237 -5 => -0.00624', () => {
    assert.equal(ceil('-0.006237', -5), '-0.00624')
  })
  it('-12345.678 8 => -100000000', () => {
    assert.equal(ceil('-12345.678', 8), '-100000000')
  })
  it('-12345.678 5 => -100000', () => {
    assert.equal(ceil('-12345.678', 5), '-100000')
  })
  it('-12345.678 -6 => -12345.678', () => {
    assert.equal(ceil('-12345.678', -6), '-12345.678')
  })
  it('-12345.678 -3 => -12345.678', () => {
    assert.equal(ceil('-12345.678', -3), '-12345.678')
  })
  it('12000 3 => 12000', () => {
    assert.equal(ceil('12000', -3), '12000')
  })
  it('12345.678 -3 => 12345.678', () => {
    assert.equal(ceil('12345.678', -3), '12345.678')
  })
  it('12345.678 -1 => 12345.7', () => {
    assert.equal(ceil('12345.678', -1), '12345.7')
  })
  it('12345.678 0 => 12346', () => {
    assert.equal(ceil('12345.678', 0), '12346')
  })
  it('12345.678 2 => 12400', () => {
    assert.equal(ceil('12345.678', 2), '12400')
  })
  it('12345.000 2 => 12400', () => {
    assert.equal(ceil('12345.000', 2), '12400')
  })
  it('19945 2 => 20000', () => {
    assert.equal(ceil('19945', 2), '20000')
  })
  it('12345 2 => 12400', () => {
    assert.equal(ceil('12345', 2), '12400')
  })
})

describe('floor', () => {
  it('-0.006237 -5 => -0.00623', () => {
    assert.equal(floor('-0.006237', -5), '-0.00623')
  })
  it('-12345.678 8 => 0', () => {
    assert.equal(floor('-12345.678', 8), '0')
  })
  it('-12345.678 5 => 0', () => {
    assert.equal(floor('-12345.678', 5), '0')
  })
  it('-12345.678 -6 => -12345.678', () => {
    assert.equal(floor('-12345.678', -6), '-12345.678')
  })
  it('-12345.678 -3 => -12345.678', () => {
    assert.equal(floor('-12345.678', -3), '-12345.678')
  })
  it('12345.678 -3 => 12345.678', () => {
    assert.equal(floor('12345.678', -3), '12345.678')
  })
  it('12345.678 -1 => 12345.6', () => {
    assert.equal(floor('12345.678', -1), '12345.6')
  })
  it('12345.678 0 => 12345', () => {
    assert.equal(floor('12345.678', 0), '12345')
  })
  it('12345.678 2 => 12300', () => {
    assert.equal(floor('12345.678', 2), '12300')
  })
  it('12345.000 2 => 12300', () => {
    assert.equal(floor('12345.000', 2), '12300')
  })
  it('12345 2 => 12300', () => {
    assert.equal(floor('12345', 2), '12300')
  })
})
