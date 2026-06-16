/**
 * Created by paul on 7/25/17.
 */

interface ShiftPair {
  shift: number
  x: string
  y: string
}

const SCI_NOTATION_REGEX = /^(-?\d*\.?\d*)e((?:\+|-)?\d+)$/

// -----------------------------------------------------------------------------
// Timing instrumentation
// -----------------------------------------------------------------------------
//
// Accumulates wall-clock time spent inside the biggystring public API so the
// cost of the library can be measured and compared across implementations
// (bn.js vs native BigInt) and across environments (React Native Hermes vs the
// plugin WebView). Disabled by default so it adds no measurable cost to normal
// use; call biggyTimer('start') to begin collecting and periodic logging.
//
// Prefers the high-resolution performance.now() when present (always in a
// WebView, and in modern Hermes) and falls back to Date.now() elsewhere.

const now: () => number =
  typeof performance !== 'undefined' && typeof performance.now === 'function'
    ? () => performance.now()
    : () => Date.now()

let biggyEnabled = false
let biggyDepth = 0
let biggyEntryTime = 0
let biggyStartTime = 0
let biggyTotalTime = 0
let bigintTotalTime = 0
let biggyCallCount = 0
let biggyInterval: ReturnType<typeof setInterval> | undefined

// Re-entrancy guarded so nested public calls (e.g. round -> add) are counted
// once, yielding the true total wall time spent servicing biggystring calls.
function time<T>(fn: () => T): T {
  if (!biggyEnabled) return fn()
  if (biggyDepth === 0) biggyEntryTime = now()
  biggyDepth++
  try {
    return fn()
  } finally {
    biggyCallCount++
    biggyDepth--
    if (biggyDepth === 0) biggyTotalTime += now() - biggyEntryTime
  }
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

export function add(
  x1: string | number,
  y1: string | number,
  base: number = 10
): string {
  return time(() => {
    if (base !== 10 && base !== 16) throw new Error('Unsupported base')
    const { x, y, shift } = floatShifts(x1, y1)
    const xBig = parseBigInt(x)
    const yBig = parseBigInt(y)
    const result = xBig + yBig
    let out = result.toString(base)
    out = addDecimal(out, shift)
    return base === 10 ? out : out.replace(/^(-)?/, '$10x')
  })
}

export function mul(
  x1: string | number,
  y1: string | number,
  base: number = 10
): string {
  return time(() => {
    if (base !== 10 && base !== 16) throw new Error('Unsupported base')
    const { x, y, shift } = floatShifts(x1, y1)
    const xBig = parseBigInt(x)
    const yBig = parseBigInt(y)
    const result = xBig * yBig
    let out = result.toString(base)
    out = addDecimal(out, shift * 2)
    return base === 10 ? out : out.replace(/^(-)?/, '$10x')
  })
}

export function sub(
  x1: string | number,
  y1: string | number,
  base: number = 10
): string {
  return time(() => {
    if (base !== 10 && base !== 16) throw new Error('Unsupported base')
    const { x, y, shift } = floatShifts(x1, y1)
    const xBig = parseBigInt(x)
    const yBig = parseBigInt(y)
    const result = xBig - yBig
    let out = result.toString(base)
    out = addDecimal(out, shift)
    return base === 10 ? out : out.replace(/^(-)?/, '$10x')
  })
}

export function div(
  x1: string | number,
  y1: string | number,
  precision: number = 0,
  base: number = 10
): string {
  return time(() => {
    if (base !== 10 && precision > 0) {
      throw new Error('Cannot operate on floating point hex values')
    }
    if (base !== 10 && base !== 16) throw new Error('Unsupported base')
    const { x, y } = floatShifts(x1, y1, precision)
    const xBig = parseBigInt(x)
    const yBig = parseBigInt(y)
    const result = xBig / yBig
    let out = result.toString(base)
    out = addDecimal(out, precision)
    return base === 10 ? out : out.replace(/^(-)?/, '$10x')
  })
}

export function lt(x1: string | number, y1: string | number): boolean {
  return time(() => {
    const { x, y } = floatShifts(x1, y1)
    return parseBigInt(x) < parseBigInt(y)
  })
}

export function lte(x1: string | number, y1: string | number): boolean {
  return time(() => {
    const { x, y } = floatShifts(x1, y1)
    return parseBigInt(x) <= parseBigInt(y)
  })
}

export function gt(x1: string | number, y1: string | number): boolean {
  return time(() => {
    const { x, y } = floatShifts(x1, y1)
    return parseBigInt(x) > parseBigInt(y)
  })
}

export function gte(x1: string | number, y1: string | number): boolean {
  return time(() => {
    const { x, y } = floatShifts(x1, y1)
    return parseBigInt(x) >= parseBigInt(y)
  })
}

export function eq(x1: string | number, y1: string | number): boolean {
  return time(() => {
    const { x, y } = floatShifts(x1, y1)
    return parseBigInt(x) === parseBigInt(y)
  })
}

export function min(
  x1: string | number,
  y1: string | number,
  base: number = 10
): string {
  return time(() => {
    const { x, y, shift } = floatShifts(x1, y1)
    const xBig = parseBigInt(x)
    const yBig = parseBigInt(y)
    let out
    if (xBig <= yBig) {
      out = xBig.toString(base)
    } else {
      out = yBig.toString(base)
    }
    out = addDecimal(out, shift)
    return base === 10 ? out : out.replace(/^(-)?/, '$10x')
  })
}

export function abs(x1: string | number, base: number = 10): string {
  return time(() => {
    if (base !== 10 && base !== 16) throw new Error('Unsupported base')
    const { x, shift } = floatShifts(x1, '0')
    const xBig = parseBigInt(x)
    const absBig = xBig < 0n ? -xBig : xBig
    let out = absBig.toString(base)
    out = addDecimal(out, shift)
    return base === 10 ? out : out.replace(/^(-)?/, '$10x')
  })
}

export function max(
  x1: string | number,
  y1: string | number,
  base: number = 10
): string {
  return time(() => {
    const { x, y, shift } = floatShifts(x1, y1)
    const xBig = parseBigInt(x)
    const yBig = parseBigInt(y)
    let out
    if (xBig >= yBig) {
      out = xBig.toString(base)
    } else {
      out = yBig.toString(base)
    }
    out = addDecimal(out, shift)
    return base === 10 ? out : out.replace(/^(-)?/, '$10x')
  })
}

export const floor = (x1: string | number, precision: number): string =>
  time(() => precisionAdjust('floor', x1, precision))

export const ceil = (x1: string | number, precision: number): string =>
  time(() => precisionAdjust('ceil', x1, precision))

export const round = (x1: string | number, precision: number): string =>
  time(() => precisionAdjust('round', x1, precision))

export function toBns(n: number | string): string {
  return time(() => {
    let out = typeof n === 'number' ? n.toString() : n.replace(/^\s+|\s+$/g, '')
    if (out === '' || out === '.') {
      out = '0'
    }

    // Handle scientific notation (skip the regex unless an 'e' is present)
    if (out.indexOf('e') !== -1) {
      const match = out.match(SCI_NOTATION_REGEX)
      if (match != null) {
        const base = match[1]
        const exponent = parseInt(match[2])
        out = sciNotation(base, exponent)
      }
    }

    validate(out)

    return out
  })
}

export function toFixed(
  x1: string | number,
  minPrecision: number = 2,
  maxPrecision: number = 8
): string {
  return time(() => {
    let x = toBns(x1)

    let negative = false
    let out = ''

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

    // Remove trailing "." if there is one
    out = out.replace(/\.+$/, '')

    if (negative && out !== '0') {
      out = '-' + out
    }
    return out
  })
}

export function log10(x: string): number {
  return time(() => {
    if (!(x.match(/^[0-1]+$/g) !== null)) {
      throw new Error('InvalidLogInputValue: Must be a power of 10')
    }
    if (!x.startsWith('1')) {
      throw new Error('InvalidLogInputValue: Must not have leading zeros')
    }
    if ((x.match(/1/g) || []).length > 1) {
      throw new Error('InvalidLogInputValue: Must be power of 10.')
    }
    return (x.match(/0/g) || []).length
  })
}

// -----------------------------------------------------------------------------
// Timing API
// -----------------------------------------------------------------------------

export interface BiggyStats {
  totalRunningMs: number
  biggystringMs: number
  bigintMs: number
  outsideBigintMs: number
  callCount: number
}

export function getBiggyStats(): BiggyStats {
  const totalRunningMs = biggyStartTime === 0 ? 0 : now() - biggyStartTime
  return {
    totalRunningMs,
    biggystringMs: biggyTotalTime,
    bigintMs: bigintTotalTime,
    outsideBigintMs: biggyTotalTime - bigintTotalTime,
    callCount: biggyCallCount
  }
}

export function resetBiggyStats(): void {
  biggyStartTime = now()
  biggyTotalTime = 0
  bigintTotalTime = 0
  biggyCallCount = 0
}

export function printBiggyStats(): void {
  const s = getBiggyStats()
  const pct = (n: number, d: number): string =>
    d === 0 ? 'n/a' : `${((n / d) * 100).toFixed(2)}%`
  console.log('--- biggystring stats ---')
  console.log('  total running time (ms):', s.totalRunningMs.toFixed(3))
  console.log('  biggystring time   (ms):', s.biggystringMs.toFixed(3))
  console.log('  inside BigInt time (ms):', s.bigintMs.toFixed(3))
  console.log('  outside BigInt time(ms):', s.outsideBigintMs.toFixed(3))
  console.log('  total calls            :', s.callCount)
  console.log('  biggystring / running  :', pct(s.biggystringMs, s.totalRunningMs))
  console.log('  BigInt / running       :', pct(s.bigintMs, s.totalRunningMs))
  console.log('  BigInt / biggystring   :', pct(s.bigintMs, s.biggystringMs))
}

// Begin or end a measurement session. While running, stats accumulate and are
// printed to the console every 5 seconds; 'stop' prints a final summary.
export function biggyTimer(action: 'start' | 'stop'): void {
  if (action === 'start') {
    biggyEnabled = true
    resetBiggyStats()
    biggyInterval = setInterval(printBiggyStats, 5000)
    console.log('biggyTimer started')
  } else {
    if (biggyInterval != null) clearInterval(biggyInterval)
    biggyInterval = undefined
    printBiggyStats()
    biggyEnabled = false
    console.log('biggyTimer stopped')
  }
}

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------

// BigInt() throws on signed non-decimal literals like '-0x100' because the
// spec's StringIntegerLiteral grammar only allows a sign on decimal numerals.
// Strip a leading '-' and re-apply it after parsing so hex inputs work.
const parseBigInt = (value: string): bigint => {
  if (!biggyEnabled) {
    return value.startsWith('-') ? -BigInt(value.slice(1)) : BigInt(value)
  }
  const start = now()
  const result = value.startsWith('-') ? -BigInt(value.slice(1)) : BigInt(value)
  bigintTotalTime += now() - start
  return result
}

function addDecimal(x: string, shift: number): string {
  if (shift === 0) return x
  let isNegative = false
  if (x.slice(0, 1) === '-') {
    isNegative = true
    x = x.slice(1)
  }
  let out
  if (shift > x.length) {
    out = '0.' + addZeros('', shift - x.length) + x
  } else {
    out =
      x.substr(0, x.length - shift) + '.' + x.substr(x.length - shift, x.length)
  }
  out = trimEnd(out)
  if (isNegative) {
    out = `-${out}`
  }
  return out
}

function addZeros(val: string, numZeros: number): string {
  let out = val
  for (let n = 0; n < numZeros; n++) {
    out += '0'
  }
  return out
}

// Takes two floating point (base 10) numbers and finds the multiplier needed to make them both
// operable as a integer
function floatShifts(
  xStart: string | number,
  yStart: string | number,
  moreShift?: number
): ShiftPair {
  let x = toBns(xStart)
  let y = toBns(yStart)
  let xPos: number = x.indexOf('.')
  let yPos: number = y.indexOf('.')

  const xHex: boolean = isHexStr(x)
  const yHex: boolean = isHexStr(y)

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

    const shift = xShift > yShift ? xShift : yShift
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
      x,
      y,
      shift: 0,
    }
    return out
  }
}

// Expects an already-normalized (toBns) string. A normalized base-10 number
// only contains [0-9.-], so any hex marker ('x' from a 0x prefix or an a-f
// digit) means the value is base 16.
function isHexStr(x: string): boolean {
  return /[a-fx]/i.test(x)
}

function precisionAdjust(
  type: 'ceil' | 'floor' | 'round',
  x1: string | number,
  precision: number = 0
): string {
  let x = toBns(x1)

  let negative = false
  let out = ''

  if (x.includes('-')) {
    negative = true
    // Remove any leading '-' signs
    x = x.replace(/^-+/, '')
  }
  const [whole, decimal = ''] = x.split('.')

  // Number of decimal places number has
  const decimalPos = x.indexOf('.')
  const checkIndex =
    decimalPos !== -1 ? decimalPos - precision : x.length - precision
  const combined = whole + decimal

  if (type === 'round') {
    const checkValue = combined[checkIndex] ?? '0'
    if (checkValue >= '5') {
      type = 'ceil'
    } else {
      type = 'floor'
    }
  }

  // Zero out lower precision places
  const numZeros = Math.max(combined.length - checkIndex + 1, 0)
  const zeroString = new Array(numZeros).join('0')
  let outCombined = combined.substring(0, checkIndex) + zeroString
  const bumpUp = /[1-9]/.test(combined.substring(checkIndex))
  if (type === 'ceil' && bumpUp) {
    const addValue = '1' + zeroString

    // Leading zeros get removed after an `add`. Save the number of leading zeros
    // and add them back
    const leadingZeros = (outCombined.match(/^0+/) ?? [''])[0].length
    const leadingZerosString = new Array(leadingZeros).join('0')
    outCombined = leadingZerosString + add(outCombined, addValue)
  }

  const newDecimalPos = decimalPos + (outCombined.length - combined.length)
  // Add back the decimal
  if (decimalPos !== -1) {
    out =
      outCombined.substring(0, newDecimalPos) +
      '.' +
      outCombined.substring(newDecimalPos)
  } else {
    out = outCombined
  }

  out = trimEnd(out)

  if (negative && out !== '0') {
    out = '-' + out
  }
  return out
}

function sciNotation(x1: string, exponent: number): string {
  const magnitude =
    exponent >= 0
      ? '1' + '0'.repeat(Math.abs(exponent)) // 5.8e7 -> 58000000
      : `0.${'0'.repeat(Math.abs(exponent) - 1)}1` // 5.8e-7 -> 0.00000058
  return mul(x1, magnitude)
}

// Remove starting and trailing zeros and decimal, in a single index scan.
function trimEnd(val: string): string {
  const dot = val.indexOf('.')
  let start = 0
  while (start < val.length && val.charCodeAt(start) === 48) start++
  if (dot === -1) {
    // Integer: keep trailing zeros, drop leading zeros, empty becomes '0'.
    return start >= val.length ? '0' : val.slice(start)
  }
  let end = val.length
  while (end > dot && val.charCodeAt(end - 1) === 48) end--
  if (end - 1 === dot) end = dot
  let intPart = val.slice(start, dot)
  if (intPart === '') intPart = '0'
  return end <= dot ? intPart : intPart + val.slice(dot, end)
}

function validate(...args: string[]): void {
  for (const arg of args) {
    if (arg.indexOf('.') !== arg.lastIndexOf('.')) {
      throw new Error(`Invalid number: more than one decimal point '${arg}'`)
    }
    if (arg.indexOf('-') !== arg.lastIndexOf('-')) {
      throw new Error(`Invalid number: more than one negative sign '${arg}'`)
    }
    if (!/^-?(?:0x[0-9A-Fa-f]+|(?:\d+(?:\.\d*)?|\.\d+))$/.test(arg)) {
      throw new Error(`Invalid number: non-number characters '${arg}'`)
    }
  }
}
