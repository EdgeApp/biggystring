# biggystring

Floating point big number library using only strings as inputs and outputs

## Install

    npm install biggystring

## Use

    const bs = require('biggystring')

### Basic Math

    console.log(bs.add('32', '10') // => '42'
    console.log(bs.sub('32', '10') // => '22'
    console.log(bs.mul('32', '10') // => '320'
    console.log(bs.div('32', '10') // => '3' Truncates remainder

### Hex

    console.log(bs.add('0xa', '10')   // => '20'
    console.log(bs.add('0xa', '0x20') // => '42'
    console.log(bs.add('10', '0x10')  // => '26'

### Comparisons

    console.log(bs.gt('32', '10')  // => True
    console.log(bs.lt('32', '10')  // => False
    console.log(bs.gte('32', '32') // => True
    console.log(bs.lte('32', '10') // => False
    console.log(bs.eq('32', '10')  // => False
    console.log(bs.eq('32', '32')  // => True

### Floating point operations (base 10 only)

    console.log(bs.add('3.2', '1.3') // => '4.5'
    console.log(bs.sub('3.2', '1.3') // => '1.9'
    console.log(bs.mul('3.2', '1.3') // => '4.16'

    // For `div`, 3rd arg is decimal precision, 4th arg is base
    console.log(bs.div('10', '3.0', 5, 10) // => '3.33333'
    console.log(bs.div('1.23', '3.3', 5, 10) // => '0.37272'
