/**
 * Created by paul on 7/25/17.
 */
// @flow
const BN = require('bn.js')

const MAX_DECIMALS = 10

function isHex (x:string) {
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

const bns = {
  add: (x:string, y:string, base:number = 10) => {
    if (base !== 10 && base !== 16) throw new Error('Unsupported base')
    const xBase:number = isHex(x) ? 16 : 10
    const yBase = isHex(y) ? 16 : 10
    x = cropHex(x)
    y = cropHex(y)
    const xBN = new BN(x, xBase)
    const yBN = new BN(y, yBase)
    const out = xBN.add(yBN).toString(base)
    return base === 10 ? out : '0x' + out
  },
  mul: (x:string, y:string, base:number = 10) => {
    if (base !== 10 && base !== 16) throw new Error('Unsupported base')
    const xBase = isHex(x) ? 16 : 10
    const yBase = isHex(y) ? 16 : 10
    x = cropHex(x)
    y = cropHex(y)
    const xBN = new BN(x, xBase)
    const yBN = new BN(y, yBase)
    const out = xBN.mul(yBN).toString(base)
    return base === 10 ? out : '0x' + out
  },
  sub: (x:string, y:string, base:number = 10) => {
    if (base !== 10 && base !== 16) throw new Error('Unsupported base')
    const xBase = isHex(x) ? 16 : 10
    const yBase = isHex(y) ? 16 : 10
    x = cropHex(x)
    y = cropHex(y)
    const xBN = new BN(x, xBase)
    const yBN = new BN(y, yBase)
    const out = xBN.sub(yBN).toString(base)
    return base === 10 ? out : '0x' + out
  },
  div: (x:string, y:string, base:number = 10) => {
    if (base !== 10 && base !== 16) throw new Error('Unsupported base')
    const xBase = isHex(x) ? 16 : 10
    const yBase = isHex(y) ? 16 : 10
    x = cropHex(x)
    y = cropHex(y)
    const xBN = new BN(x, xBase)
    const yBN = new BN(y, yBase)
    const out = xBN.div(yBN).toString(base)
    return base === 10 ? out : '0x' + out
  },
  fixedToInt (n:number, multiplier:number) {
    const x = n.toString()
    const pos = x.indexOf('.')
    if (pos === -1) {
      throw new Error('Invalid fixed point number')
    }
    // Make sure there is only one '.'
    const lastPos = x.indexOf('.')
    if (lastPos !== pos) {
      throw new Error('Invalid fixed point number. Contains more than one decimal point')
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
  },
  intToFixed (x:string, divisor:number) {
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
}

module.exports = bns
