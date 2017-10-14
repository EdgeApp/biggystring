/**
 * Created by paul on 7/25/17.
 */
// @flow
const BN = require('bn.js')

const MAX_DECIMALS = 10

function isHex (x:string):boolean {
  if (
    x.startsWith('0x') ||
    x.toLowerCase().includes('a') ||
    x.toLowerCase().includes('b') ||
    x.toLowerCase().includes('c') ||
    x.toLowerCase().includes('d') ||
    x.toLowerCase().includes('e') ||
    x.toLowerCase().includes('f')
  ) {
    return true
  } else {
    return false
  }
}

function cropHex (x:string) {
  return x.replace('0x', '')
}

type ShiftPair = {
  shift: number,
  x: string,
  y: string
}

function addZeros (val: string, numZeros: number) {
  let out = val
  for (let n = 0; n < numZeros; n++) {
    out += '0'
  }
  return out
}

// Remove trailing zeros and decimal
function trimEnd (val: string): string {
  let out = val.replace(/^0+/, '')
  out = out.replace(/^\.+/, '0.')
  if (out.includes('.')) {
    out = out.replace(/0+$/, '')
    out = out.replace(/\.+$/, '')
    if (out === '') {
      out = '0'
    }
  }
  return out
}

function addDecimal (x: string, shift: number) {
  if (shift === 0) return x
  if (shift > x.length) {
    const out = '0.' + addZeros('', shift - x.length) + x
    return trimEnd(out)
  } else {
    const out = x.substr(0, x.length - shift) + '.' + x.substr(x.length - shift, x.length)
    return trimEnd(out)
  }
}
// Takes two floating point (base 10) numbers and finds the multiplier needed to make them both
// operable as a integer
function floatShifts (xStart:string, yStart:string, moreShift?: number): ShiftPair {
  let x = xStart
  let y = yStart
  validate(x, y)
  let xPos:number = x.indexOf('.')
  let yPos:number = y.indexOf('.')

  const xHex:boolean = isHex(x)
  const yHex:boolean = isHex(y)

  if (xPos !== -1) {
    // Remove trailing zeros
    x = trimEnd(x)
    xPos = x.indexOf('.')
  }

  if (yPos !== -1) {
    // Remove trailing zeros
    y = trimEnd(y)
    yPos = y.indexOf('.')
  }

  if (xPos !== -1 || yPos !== -1 || typeof moreShift === 'number') {
    if (xHex || yHex) {
      throw new Error('Cannot operate on base16 float values')
    }

    let xShift = 0
    let yShift = 0

    if (xPos !== -1) {
      xShift = x.length - xPos - 1
    }

    if (yPos !== -1) {
      yShift = y.length - yPos - 1
    }

    let shift = (xShift > yShift ? xShift : yShift)
    let moreS = 0
    if (typeof moreShift === 'number') {
      moreS = moreShift
    }

    x = addZeros(x.replace('.', ''), shift + moreS - xShift)
    y = addZeros(y.replace('.', ''), shift - yShift)

    const out: ShiftPair = { x, y, shift }

    return out
  } else {
    // Both x and y are int and need no float conversion
    const out: ShiftPair = {
      x, y, shift: 0
    }
    return out
  }
}

function validate (...args: Array<string>) {
  for (const arg of args) {
    if (arg.split('.').length - 1 > 1) {
      throw new Error('Invalid number: more than one decimal point')
    }
    if (arg.split('-').length - 1 > 1) {
      throw new Error('Invalid number: more than one negative sign')
    }
  }
}

function add (x1:string, y1:string, base:number = 10):string {
  if (base !== 10 && base !== 16) throw new Error('Unsupported base')
  let { x, y, shift } = floatShifts(x1, y1)
  const xBase = isHex(x) ? 16 : 10
  const yBase = isHex(y) ? 16 : 10
  x = cropHex(x)
  y = cropHex(y)
  const xBN = new BN(x, xBase)
  const yBN = new BN(y, yBase)
  let out = xBN.add(yBN).toString(base)
  out = addDecimal(out, shift)
  return base === 10 ? out : '0x' + out
}

function mul (x1:string, y1:string, base:number = 10):string {
  if (base !== 10 && base !== 16) throw new Error('Unsupported base')
  let { x, y, shift } = floatShifts(x1, y1)
  const xBase = isHex(x) ? 16 : 10
  const yBase = isHex(y) ? 16 : 10
  x = cropHex(x)
  y = cropHex(y)
  const xBN = new BN(x, xBase)
  const yBN = new BN(y, yBase)
  let out = xBN.mul(yBN).toString(base)
  out = addDecimal(out, shift * 2)
  return base === 10 ? out : '0x' + out
}

function sub (x1:string, y1:string, base:number = 10):string {
  if (base !== 10 && base !== 16) throw new Error('Unsupported base')
  let { x, y, shift } = floatShifts(x1, y1)
  const xBase = isHex(x) ? 16 : 10
  const yBase = isHex(y) ? 16 : 10
  x = cropHex(x)
  y = cropHex(y)
  const xBN = new BN(x, xBase)
  const yBN = new BN(y, yBase)
  let out = xBN.sub(yBN).toString(base)
  out = addDecimal(out, shift)
  return base === 10 ? out : '0x' + out
}

function div (x1:string, y1:string, base:number = 10, precision: number = 0):string {
  if (base !== 10 && base !== 16) throw new Error('Unsupported base')
  let { x, y } = floatShifts(x1, y1, precision)
  const xBase = isHex(x) ? 16 : 10
  const yBase = isHex(y) ? 16 : 10
  x = cropHex(x)
  y = cropHex(y)
  const xBN = new BN(x, xBase)
  const yBN = new BN(y, yBase)
  let out = xBN.div(yBN).toString(base)
  out = addDecimal(out, precision)
  return base === 10 ? out : '0x' + out
}

function lt (x1:string, y1:string):boolean {
  let { x, y } = floatShifts(x1, y1)
  const xBase = isHex(x) ? 16 : 10
  const yBase = isHex(y) ? 16 : 10
  x = cropHex(x)
  y = cropHex(y)
  const xBN = new BN(x, xBase)
  const yBN = new BN(y, yBase)
  return xBN.lt(yBN)
}

function lte (x1:string, y1:string):boolean {
  let { x, y } = floatShifts(x1, y1)
  const xBase = isHex(x) ? 16 : 10
  const yBase = isHex(y) ? 16 : 10
  x = cropHex(x)
  y = cropHex(y)
  const xBN = new BN(x, xBase)
  const yBN = new BN(y, yBase)
  return xBN.lte(yBN)
}

function gt (x1:string, y1:string):boolean {
  let { x, y } = floatShifts(x1, y1)
  const xBase = isHex(x) ? 16 : 10
  const yBase = isHex(y) ? 16 : 10
  x = cropHex(x)
  y = cropHex(y)
  const xBN = new BN(x, xBase)
  const yBN = new BN(y, yBase)
  return xBN.gt(yBN)
}

function gte (x1:string, y1:string):boolean {
  let { x, y } = floatShifts(x1, y1)
  const xBase = isHex(x) ? 16 : 10
  const yBase = isHex(y) ? 16 : 10
  x = cropHex(x)
  y = cropHex(y)
  const xBN = new BN(x, xBase)
  const yBN = new BN(y, yBase)
  return xBN.gte(yBN)
}

function eq (x1:string, y1:string):boolean {
  let { x, y } = floatShifts(x1, y1)
  const xBase = isHex(x) ? 16 : 10
  const yBase = isHex(y) ? 16 : 10
  x = cropHex(x)
  y = cropHex(y)
  const xBN = new BN(x, xBase)
  const yBN = new BN(y, yBase)
  return xBN.eq(yBN)
}

function min (x1:string, y1:string, base:number = 10):string {
  let { x, y, shift } = floatShifts(x1, y1)
  const xBase = isHex(x) ? 16 : 10
  const yBase = isHex(y) ? 16 : 10
  x = cropHex(x)
  y = cropHex(y)
  const xBN = new BN(x, xBase)
  const yBN = new BN(y, yBase)
  let out
  if (xBN.lte(yBN)) {
    out = xBN.toString(base)
  } else {
    out = yBN.toString(base)
  }
  out = addDecimal(out, shift)
  return base === 10 ? out : '0x' + out
}

function max (x1:string, y1:string, base:number = 10):string {
  let { x, y, shift } = floatShifts(x1, y1)
  const xBase = isHex(x) ? 16 : 10
  const yBase = isHex(y) ? 16 : 10
  x = cropHex(x)
  y = cropHex(y)
  const xBN = new BN(x, xBase)
  const yBN = new BN(y, yBase)
  let out
  if (xBN.gte(yBN)) {
    out = xBN.toString(base)
  } else {
    out = yBN.toString(base)
  }
  out = addDecimal(out, shift)
  return base === 10 ? out : '0x' + out
}

function divf (x:string, y:string):number {
  const shift = log10(y)
  return intToFixed(x, shift)
}

function mulf (x:number, y:string) {
  const shift = log10(y)
  return fixedToInt(x, shift)
}

function fixedToInt (n:number|string, multiplier:number):string {
  let x
  if (typeof n === 'number') {
    x = n.toString()
  } else if (typeof n === 'string') {
    x = n
  } else {
    throw new Error('Invalid input format')
  }
  let pos = x.indexOf('.')
  if (pos !== -1) {
    // Make sure there is only one '.'
    let x2 = x.substr(0, pos) + x.substr(pos + 1)
    const lastPos = x2.indexOf('.')
    if (lastPos !== -1) {
      throw new Error('Invalid fixed point number. Contains more than one decimal point')
    }
  } else {
    pos = x.length - 1
  }

  const numZerosAdd = multiplier - (x.length - pos - 1)
  if (numZerosAdd < 0) {
    throw new Error('Multiplier too small to create integer')
  }
  let out = x.replace('.', '')

  out = addZeros(out, numZerosAdd)

  return out
}

function toFixed (x1:string, precision: number) {
  validate(x1)
  let x = trimEnd(x1)

  // Number of decimal places number has
  const decimalPos = x.indexOf('.')
  if (decimalPos === -1) {
    return x + '.' + addZeros('', precision)
  } else {
    const numDecimals = x.length - decimalPos - 1
    if (numDecimals > precision) {
      return x.substr(0, x.length - (numDecimals - precision))
    } else {
      return x + addZeros('', precision - numDecimals)
    }
  }
}

function intToFixed (x:string, divisor:number):number {
  if (x.length <= divisor) {
    const leftZeros = divisor - x.length
    let out = '.'
    for (let n = 0; n < leftZeros; n++) {
      out += '0'
    }
    return parseFloat(out + x.substr(0, MAX_DECIMALS))
  } else {
    let cropRight = divisor - MAX_DECIMALS
    if (cropRight < 0) cropRight = 0
    let cropLeft = x.length - cropRight
    let out = x.substr(0, cropLeft)
    const decimalPos = x.length - divisor
    out = out.substr(0, decimalPos) + '.' + out.substr(decimalPos)
    return parseFloat(out)
  }
}

function log10 (x:string):number {
  if (!(x.match(/^[0-1]+$/g) !== null)) {
    throw new Error('InvalidLogInputValue: Must be a power of 10')
  }
  if (!(x.startsWith('1'))) {
    throw new Error('InvalidLogInputValue: Must not have leading zeros')
  }
  if ((x.match(/1/g) || []).length > 1) {
    throw new Error('InvalidLogInputValue: Must be power of 10.')
  }
  return (x.match(/0/g) || []).length
}

const bns = { add, sub, mul, div, gt, lt, gte, lte, eq, mulf, divf, min, max, log10, toFixed }

export { add, sub, mul, div, gt, lt, gte, lte, eq, mulf, divf, min, max, log10, toFixed, bns }
