# biggystring

## Unreleased

- fixed: Treat '.' as zero

## 4.2.2 (2024-07-15)

- fixed: Update validate regex to exclude hex strings, integers and floats

## 4.2.1 (2024-06-25)

- fixed: Crash when using strings with spaces

## 4.2.0 (2023-12-05)

- added: New toBns function to convert JS number to big number strings
- changed: Implement toBns for all public API to expand argument type support

## 4.1.3 (2023-01-09)

- Fix library path

## 4.1.2 (2023-01-09)

- Fix round/ceil for subzero numbers with leading zeros after decimal point

## 4.1.1 (2022-12-27)

- Fix 0x prefix for negative hex numbers

## 4.1.0 (2022-12-16)

- add: floor, ceil, round functions
- change: Modernize testing workflow
