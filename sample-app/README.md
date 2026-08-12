# `sample-app/` — the app every workflow in this course runs against

Copy this **whole folder to the root of your practice repo**, keeping the name
`sample-app`. The workflows hardcode that path in three places
(`working-directory`, `cache-dependency-path`, and `paths:` filters), so
renaming it or nesting it deeper means editing every file.

It is **zero-dependency on purpose**: nothing to install, no package that can
break a demo mid-recording, and `package-lock.json` is committed so
`npm ci` and `cache: 'npm'` work from the very first run.

## What's here

| File | Why it exists |
|---|---|
| `src/math.js` | The library under test — `add`, `multiply`. What CodeQL scans. |
| `src/index.js` | The entry point. What the Docker image runs. |
| `test/math.test.js` | Tests, using Node's **built-in** runner (`node --test`). ESM. |
| `build.js` | A fake build: copies `src/` → `dist/` and stamps `build-info.json`. |
| `Dockerfile` | The image the GHCR workflows build and push. |
| `package-lock.json` | Committed so `npm ci` works. Do not delete. |

## The four commands the workflows call

```bash
npm ci          # install (deterministic; fails loudly if the lockfile disagrees)
npm run lint    # node --check on each src file — syntax only, no ESLint
npm test        # node --test — discovers test/*.test.js
npm run build   # node build.js -> dist/
npm start       # node src/index.js (also the container's CMD)
```

## ⚠️ It is an ES module

`package.json` sets `"type": "module"`, so every `.js` file here uses
`import` / `export` — and `import` paths need the **file extension**
(`'../src/math.js'`, not `'../src/math'`).

Paste a CommonJS file in and the whole test run dies before a single assertion:

```
ReferenceError: require is not defined in ES module scope, you can use import instead
```

If you see that, the file came from somewhere else. Convert it to `import`, or
rename it to `.cjs`.

## Which topics need what

Most files work with just the folder as-is. The exceptions:

- **25 / 34** (artifacts, capstone) call `npm run build` — needs `build.js` **and**
  the current `package.json`. A `sample-app` copied during Day 1 lacks the
  `build` script and fails with `npm error Missing script: "build"`.
- **26** (matrix artifacts) writes `reports/` — gitignored, produced per run.
- **44 / 48** (GHCR) build the `Dockerfile` with **`context: ./sample-app`**.
- **36 / 48** (CodeQL) scan `src/` as `javascript-typescript`.
