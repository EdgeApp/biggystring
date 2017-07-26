/**
 * Created by paul on 7/25/17.
 */
// @flow
const BN = require('bn.js')

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

const bns = {
  add: (x:string, y:string, base:number = 10) => {
    const xBase:number = isHex(x) ? 16 : 10
    const yBase = isHex(y) ? 16 : 10
    const xBN = new BN(x, xBase)
    const yBN = new BN(y, yBase)
    return xBN.add(yBN).toString(base)
  },
  mul: (x:string, y:string, base:number = 10) => {
    const xBase = isHex(x) ? 16 : 10
    const yBase = isHex(y) ? 16 : 10
    const xBN = new BN(x, xBase)
    const yBN = new BN(y, yBase)
    return xBN.mul(yBN).toString(base)
  },
  sub: (x:string, y:string, base:number = 10) => {
    const xBase = isHex(x) ? 16 : 10
    const yBase = isHex(y) ? 16 : 10
    const xBN = new BN(x, xBase)
    const yBN = new BN(y, yBase)
    return xBN.sub(yBN).toString(base)
  },
  div: (x:string, y:string, base:number = 10) => {
    const xBase = isHex(x) ? 16 : 10
    const yBase = isHex(y) ? 16 : 10
    const xBN = new BN(x, xBase)
    const yBN = new BN(y, yBase)
    return xBN.div(yBN).toString(base)
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

  }
}

module.exports = bns
