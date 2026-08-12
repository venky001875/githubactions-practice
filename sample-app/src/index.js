// The app's ENTRY POINT — the thing the Docker image runs (files 44 and 48).
// Everything else in this folder is a library; this is the process.
//
// Still zero dependencies: Node's standard library only, so `docker build`
// never has to reach the network for a package.

import { add, multiply } from './math.js';

// `process.argv` is [node, script, ...args]. Two optional numbers, so the
// container can be run as `docker run IMAGE 7 6` and show different output.
const args = process.argv.slice(2).map(Number);
const [a, b] = args.every(Number.isFinite) && args.length === 2 ? args : [2, 3];

console.log('gha-sample-app');
console.log(`node          ${process.version}`);
console.log(`add(${a}, ${b})       = ${add(a, b)}`);
console.log(`multiply(${a}, ${b})  = ${multiply(a, b)}`);
