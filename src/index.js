/**
 * Created by paul on 7/25/17.
 */
// @flow
import { BN } from 'bn.js'

function isHex (x:string) {
  if (
    x.startsWith('0x') ||
    x.toLowerCase().contains('a') ||
    x.toLowerCase().contains('b') ||
    x.toLowerCase().contains('c') ||
    x.toLowerCase().contains('d') ||
    x.toLowerCase().contains('e') ||
    x.toLowerCase().contains('f')
  ) {
    return true
  } else {
    return false
  }
}

const bns = {
  add: (x:string, y:string, base:number = 10) => {
    const xBase = isHex(x) ? 16 : 10
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
  iadd: (x:string, y:string, base:number = 10) => {
    x = this.add(x, y, base)
  },
  imul: (x:string, y:string, base:number = 10) => {
    x = this.mul(x, y, base)
  },
  isub: (x:string, y:string, base:number = 10) => {
    x = this.sub(x, y, base)
  },
  idiv: (x:string, y:string, base:number = 10) => {
    x = this.div(x, y, base)
  }
}

export default bns
