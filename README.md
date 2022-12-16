# biggystring

Floating point big number library using only strings as inputs and outputs

## Install

    npm install biggystring

## Use

    const bs = require('biggystring')

### Basic Math

    bs.add('32', '10') // => '42'
    bs.sub('32', '10') // => '22'
    bs.mul('32', '10') // => '320'
    bs.div('32', '10') // => '3' Truncates remainder

### Hex

    bs.add('0xa', '10')   // => '20'
    bs.add('0xa', '0x20') // => '42'
    bs.add('10', '0x10')  // => '26'

### Comparisons

    bs.gt('32', '10')  // => True
    bs.lt('32', '10')  // => False
    bs.gte('32', '32') // => True
    bs.lte('32', '10') // => False
    bs.eq('32', '10')  // => False
    bs.eq('32', '32')  // => True

### Floating point operations (base 10 only)

    bs.add('3.2', '1.3') // => '4.5'
    bs.sub('3.2', '1.3') // => '1.9'
    bs.mul('3.2', '1.3') // => '4.16'

    // For `div`, 3rd arg is decimal precision, 4th arg is base
    bs.div('10', '3.0', 5, 10) // => '3.33333'
    bs.div('1.23', '3.3', 5, 10) // => '0.37272'

### Rounding functions (base 10 only)

    bs.floor('123.456', 0) => '123'
    bs.floor('123.456', 1) => '120'
    bs.floor('123.456', -1) => '123.4'
    
    bs.ceil('123.456', 0) => '124'
    bs.ceil('123.456', 1) => '130'
    bs.ceil('123.456', -1) => '123.5'

    bs.round('123.456', 0) => '123'
    bs.round('125.456', 1) => '130'
    bs.round('123.456', -1) => '123.5'
