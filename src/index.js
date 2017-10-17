/**
 * Created by paul on 7/25/17.
 */
// @flow
const BN = require('bn.js')

// const MAX_DECIMALS = 10

function isHex (x:string):boolean {
  if (
    x.startsWith('0x') ||
    x.startsWith('-0x') ||
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

// Remove starting and trailing zeros and decimal
function trimEnd (val: string): string {
  // Remove starting zeros if there are any
  let out = val.replace(/^0+/, '')
  out = out.replace(/^\.+/, '0.')
  if (out.includes('.')) {
    // Remove trailing zeros
    out = out.replace(/0+$/, '')

    // Remove trailing "." if there is one
    out = out.replace(/\.+$/, '')
    if (out === '') {
      out = '0'
    }
  }
  if (out === '') {
    out = '0'
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

function div (x1:string, y1:string, precision: number = 0, base:number = 10):string {
  if (base !== 10 && precision > 0) {
    throw new Error('Cannot operate on floating point hex values')
  }
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

function abs (x1:string, base:number = 10):string {
  if (base !== 10 && base !== 16) throw new Error('Unsupported base')
  let { x, shift } = floatShifts(x1, '0')
  const xBase = isHex(x1) ? 16 : 10
  x = cropHex(x)
  const xBN = new BN(x, xBase)
  let out = xBN.abs(xBN).toString(base)
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

function toFixed (x1:string, minPrecision: number = 2, maxPrecision: number = 8) {
  validate(x1)
  let negative = false
  let out = ''
  let x = x1

  if (x.includes('-')) {
    negative = true
    // Remove any leading '-' signs
    x = x.replace(/^-+/, '')
  }
  x = trimEnd(x)

  // Number of decimal places number has
  const decimalPos = x.indexOf('.')
  if (decimalPos === -1) {
    out = x + '.' + addZeros('', minPrecision)

    // Remove trailing "." if there is one
    out = out.replace(/\.+$/, '')
  } else {
    const numDecimals = x.length - decimalPos - 1
    if (numDecimals > maxPrecision) {
      out = x.substr(0, x.length - (numDecimals - maxPrecision))
    } else if (numDecimals < minPrecision) {
      out = x + addZeros('', minPrecision - numDecimals)
    } else {
      out = x
    }
  }

  if (negative) {
    out = '-' + out
  }
  return out
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

const bns = { add, sub, mul, div, gt, lt, gte, lte, eq, min, max, log10, toFixed, abs }

export { add, sub, mul, div, gt, lt, gte, lte, eq, min, max, log10, toFixed, abs, bns }
