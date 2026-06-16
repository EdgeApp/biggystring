# biggystring

## Unreleased

## 5.0.0 (unreleased)

- changed: Replace `bn.js` dependency with native `BigInt`. Now requires Node.js >= 10.4.
- changed: Bump TypeScript target to ES2020.
- changed: Optimize `floatShifts` to stop re-normalizing operands through `toBns` inside `isHex` and to avoid per-call allocations in the hex check, scientific-notation match, and `validate`. Roughly halves core operation cost.
- changed: Optimize `precisionAdjust` (floor/ceil/round) to check rounding digits directly instead of routing them through the full bignum API, and rewrite `trimEnd` as a single index scan instead of four regex passes. About 1.6x faster on rounding-heavy and decimal-heavy workloads.
- added: Opt-in timing instrumentation (`biggyTimer`, `getBiggyStats`, `printBiggyStats`, `resetBiggyStats`) to measure wall-clock time spent inside the library. Disabled by default.

## 4.3.0 (2026-06-12)

- changed: Convert the build tooling from Yarn to npm.
- security: Upgrade dependencies per Socket security recommendations.

## 4.2.3 (2024-07-16)

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
