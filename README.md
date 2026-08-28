# predeps

A small CLI that scans `node_modules` and flags dependencies that execute code on the host machine during `npm install`.

## Why

When `npm install` is run, npm executes all lifecycle scripts in the tree,including the ones not in our `package.json`. Most projects have hundreds of packages installed without our knowledge (or maybe we just overlook them), but any one of these packages can contain malicious code that runs before we write our first line of code.

This is how supply chain attacks most often happen.

The approach here borrows from something I built at university — a DNS sinkhole using BIND, which blocked malware from reaching its command-and-control servers by intercepting the lookup. Same instinct, different layer: catch it at the point of execution rather than after.

## What it checks

Each signal contributes to a score. Nothing is blocked — the output is meant to be read by a human.

| Signal | Why it matters | Status |
| --- | --- | --- |
| Lifecycle scripts | Arbitrary code execution at install time | Implemented |
| Typosquatting | Name within edit distance 1 of a top-N packages | Implemented |
| Published < 30 days | Little community exposure so far | Planned |
| Single maintainer | One compromised account is enough | Planned |

## Usage

```bash
git clone https://github.com/OluwaDraco/predeps
cd predeps
npm install

# point it at any project that has already run npm install
node predeps.js ../some-project
```

## Example output

```
MEDIUM
  @iarna/toml@2.2.5
    prepare: npm run setup-burntsushi-toml-suite && npm run setup-iarna-toml-suite
  is-plain-object@5.0.0
    prepare: rollup -c
  is-plain-object@5.0.0
    prepare: rollup -c
  @szmarczak/http-timer@4.0.6
    prepare: npm run build
  acorn@7.4.1
    prepare: cd ..; npm run build:main && npm run build:bin
  core-js@2.6.11
    .............................
  60 packages ran install scripts out of 1390 (4.3%)

```

## What I found

## first run
I ran it against `https://github.com/jackspirou/clientjs` and my naive version flagged 60 packages out of 1,390. When I checked why, 57 of them couldn't execute at all - they were `prepare` scripts. They don't run when you install from the registry, it only fires for git dependencies and for the project you're installing into. So the real number was 3.
Detection was the easy part. Knowing which hooks actually fire in which install context is what separates a useful signal from noise.

## Limitations
- The package walker descends into test fixture directories, so packages like
  `resolve` contribute deliberately broken `package.json` files to the count.
- Subpath stubs (`rxjs/operators` and similar) are counted as packages, which
  inflates the total.