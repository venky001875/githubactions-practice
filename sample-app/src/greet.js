// ⚠️ DELIBERATELY VULNERABLE — this file exists only to make CodeQL light up.
// Nothing imports it: `src/index.js` is the app's entry point and never calls
// either function here, so the demo can't break `npm start` or `npm test`.
//
// There are TWO bugs on purpose, and they surface at DIFFERENT query settings:
//
//   1. cleanReports()  ->  js/shell-command-injection-from-environment
//                          precision HIGH   -> in CodeQL's DEFAULT suite.
//   2. greet()         ->  js/indirect-command-line-injection
//                          precision MEDIUM -> needs `queries: security-extended`.
//
// The default suite only admits high/very-high precision security queries, so
// out of the box you get ONE alert here, not two. That gap is the lesson —
// see README section 32.

import { execSync } from 'node:child_process';
import path from 'node:path';

// BAD 1 — `process.cwd()` is an absolute path taken from the environment, and
// interpolating it into a shell string hands the shell control of it. Run the
// app from a directory whose name contains a space (or a `;`) and `rm -rf`
// deletes something other than what you meant.
export function cleanReports() {
  const reportDir = path.join(process.cwd(), 'reports');
  execSync(`rm -rf ${reportDir}`);
}

// BAD 2 — `process.argv` is untrusted input: whoever starts the process
// controls it. `node src/greet.js "x; whoami"` runs BOTH commands, because the
// shell splits on the `;` — Node never sees two commands.
export function greet() {
  const name = process.argv[2] || 'world';
  execSync(`echo Hello, ${name}`, { stdio: 'inherit' });
}

// The fix for both is identical, and it is NOT escaping the input: stop
// building a shell string at all. Pass the command and its arguments
// separately so no shell ever parses them —
//     execFileSync('rm', ['-rf', reportDir])
//     execFileSync('echo', ['Hello,', name])
