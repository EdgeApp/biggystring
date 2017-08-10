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

function add (x:string, y:string, base:number = 10):string {
  if (base !== 10 && base !== 16) throw new Error('Unsupported base')
  const xBase:number = isHex(x) ? 16 : 10
  const yBase = isHex(y) ? 16 : 10
  x = cropHex(x)
  y = cropHex(y)
  const xBN = new BN(x, xBase)
  const yBN = new BN(y, yBase)
  const out = xBN.add(yBN).toString(base)
  return base === 10 ? out : '0x' + out
}

function mul (x:string, y:string, base:number = 10):string {
  if (base !== 10 && base !== 16) throw new Error('Unsupported base')
  const xBase = isHex(x) ? 16 : 10
  const yBase = isHex(y) ? 16 : 10
  x = cropHex(x)
  y = cropHex(y)
  const xBN = new BN(x, xBase)
  const yBN = new BN(y, yBase)
  const out = xBN.mul(yBN).toString(base)
  return base === 10 ? out : '0x' + out
}

function sub (x:string, y:string, base:number = 10):string {
  if (base !== 10 && base !== 16) throw new Error('Unsupported base')
  const xBase = isHex(x) ? 16 : 10
  const yBase = isHex(y) ? 16 : 10
  x = cropHex(x)
  y = cropHex(y)
  const xBN = new BN(x, xBase)
  const yBN = new BN(y, yBase)
  const out = xBN.sub(yBN).toString(base)
  return base === 10 ? out : '0x' + out
}

function div (x:string, y:string, base:number = 10):string {
  if (base !== 10 && base !== 16) throw new Error('Unsupported base')
  const xBase = isHex(x) ? 16 : 10
  const yBase = isHex(y) ? 16 : 10
  x = cropHex(x)
  y = cropHex(y)
  const xBN = new BN(x, xBase)
  const yBN = new BN(y, yBase)
  const out = xBN.div(yBN).toString(base)
  return base === 10 ? out : '0x' + out
}

function lt (x:string, y:string):string {
  const xBase = isHex(x) ? 16 : 10
  const yBase = isHex(y) ? 16 : 10
  x = cropHex(x)
  y = cropHex(y)
  const xBN = new BN(x, xBase)
  const yBN = new BN(y, yBase)
  return xBN.lt(yBN)
}

function lte (x:string, y:string):string {
  const xBase = isHex(x) ? 16 : 10
  const yBase = isHex(y) ? 16 : 10
  x = cropHex(x)
  y = cropHex(y)
  const xBN = new BN(x, xBase)
  const yBN = new BN(y, yBase)
  return xBN.lte(yBN)
}

function gt (x:string, y:string):string {
  const xBase = isHex(x) ? 16 : 10
  const yBase = isHex(y) ? 16 : 10
  x = cropHex(x)
  y = cropHex(y)
  const xBN = new BN(x, xBase)
  const yBN = new BN(y, yBase)
  return xBN.gt(yBN)
}

function gte (x:string, y:string):string {
  const xBase = isHex(x) ? 16 : 10
  const yBase = isHex(y) ? 16 : 10
  x = cropHex(x)
  y = cropHex(y)
  const xBN = new BN(x, xBase)
  const yBN = new BN(y, yBase)
  return xBN.gte(yBN)
}

function eq (x:string, y:string):string {
  const xBase = isHex(x) ? 16 : 10
  const yBase = isHex(y) ? 16 : 10
  x = cropHex(x)
  y = cropHex(y)
  const xBN = new BN(x, xBase)
  const yBN = new BN(y, yBase)
  return xBN.eq(yBN)
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

  const addZeros = multiplier - (x.length - pos - 1)
  if (addZeros < 0) {
    throw new Error('Multiplier too small to create integer')
  }
  let out = x.replace('.', '')
  for (let n = 0; n < addZeros; n++) {
    out += '0'
  }
  return out
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

const bns = { add, sub, mul, div, gt, lt, gte, lte, eq, mulf, divf }

export { add, sub, mul, div, gt, lt, gte, lte, eq, mulf, divf, bns }
