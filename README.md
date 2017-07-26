# biggystring

Big number library using only strings as inputs and outputs

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

    console.log(bs.gt('32', '10')  // => 'True'
    console.log(bs.lt('32', '10')  // => 'False'
    console.log(bs.gte('32', '32') // => 'True'
    console.log(bs.lte('32', '10') // => 'False'
    console.log(bs.eq('32', '10')  // => 'False'
    console.log(bs.eq('32', '32')  // => 'True'

### Utility conversions

    console.log(bs.fixedToInt(12345.678, 10) // => '123456780000000'
    console.log(bs.fixedToInt(12345.67890, 3) // => Error
    console.log(bs.intToFixed('123456789012345', 8) // => '1234567.89012345'
