# Monorepo starter for StackBlitz

A small **npm workspaces monorepo** built for prototyping and demos in the browser. It gives you apps and libraries that depend on each other, a build, typecheck and tests, and a library generator, all running on [StackBlitz](https://stackblitz.com/) with nothing to install locally.

> This is a **prototyping template, not a production setup.** It trades build caching and a task graph for simplicity (see [Trade-offs](#trade-offs)).

## Why this exists

I needed a quick way to try things in a browser and simulate a real monorepo. Other monorepo tools (Nx, for example) did not work on StackBlitz in my attempts, so this uses plain npm workspaces. It is meant to be forked and thrown away.

Setup choices that mirror a real-world project:

- **Vite** for dev server and builds
- **TypeScript with `moduleResolution: "Bundler"`**, with packages resolving through their `exports` and no `paths` aliases
- **Vitest + Testing Library** for tests
- A **generator** for new libraries

## What's inside

```
.
├── apps/
│   └── react-app/        # sample Vite + React app
├── libs/
│   ├── ui-components/
├── tools/generators/
│   └── generator.js  # library generator
├── tsconfig.base.json    # shared compiler options
├── tsconfig.json         # root config for editors
├── .npmrc
└── .stackblitzrc
```

The sample code shows an app importing a library (`app → ui-components`).

> `@org` is a placeholder scope. Replace it everywhere, including `tools/generators/generator.js`.

## Getting started

**On StackBlitz:** - the `.stackblitzrc` asks it to run `npm install` and `npm run dev`. If nothing starts, run `npm run dev` in the terminal.

**Locally** (Node 20+, npm 10+):

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev`: builds the libs, then starts the app's dev server.
- `npm run build:libs`: builds the libraries in the order listed.
- `npm run build`: builds every workspace that has a `build` script.
- `npm run typecheck`: runs `tsc --noEmit` in every workspace.
- `npm test`: runs tests in every workspace that has a `test` script.
- `npm run g:lib -- <name>`: generates a new library.

**Notes**

- Libraries are built when `npm run dev` starts. After you edit one, restart `dev` or run `npm run build:libs`.
- To target a single package, use `-w`, for example `npm test -w @org/ui-components`.
- `build:libs` runs in the order listed, so if one library depends on another, list the dependency first.

## Tests

[Vitest](https://vitest.dev/) with `happy-dom` and [Testing Library](https://testing-library.com/).

```bash
npm run test
```

## Type checking

```bash
npm run typecheck
```

Each package has:

- `tsconfig.json`, used by the editor and `typecheck`. It includes tests and `vite.config.ts`.
- `tsconfig.build.json` (libraries), which emits `.d.ts` files to `dist/`. It sets `rootDir: "src"` and excludes tests, otherwise `tsc` can emit to `dist/src/`.

Packages find each other through their `exports`. A custom condition points the editor and `tsc` at the library source, so types work before the first build:

```json
"exports": {
  ".": {
    "source": "./src/index.tsx",
    "types": "./dist/index.d.ts",
    "import": "./dist/index.js"
  }
}
```

`tsconfig.base.json` enables it with `"customConditions": ["source"]`; build configs reset it to `[]` so emitted types come from `dist/`. The name must match in both places.

## Available generators

**Typescript library generator**

```bash
npm run g:lib my-lib
```

**React library generator**

```bash
npm run g:react-lib my-lib
```

**React app generator**

```bash
npm run g:app my-app
```

## Trade-offs

Compared with Nx or Turborepo:

- No build caching: every `npm run build` rebuilds everything.
- No task graph: build order between libraries is a manual list.
- No `affected` commands, project graph viewer or remote cache.

If a prototype outgrows this, move to a real build system.

## StackBlitz notes: versions and workarounds

StackBlitz runs Node inside the browser, so anything needing native binaries or a full OS environment tends to fail. That shapes the versions and tooling here.

**Versions**

- **Vite 7, not 8:** Vite 8 uses Rolldown, which needs a native binding. On StackBlitz the build fails with `Cannot find native binding`.
- **`@vitejs/plugin-react` 5, not 6:** version 6 requires Vite 8.
- **Not Vite 5:** `npm audit` flags Vite 6.4.3 and older (plus its `esbuild` dependency) for a dev-server issue. Vite 7 is clean. |

When you bump Vite, move `vite` and `@vitejs/plugin-react` together, and check the build on StackBlitz before relying on it.

## Supply-chain hygiene

I added a `.npmrc` file that blocks installing npm packages released less than 3 days ago and ignore post-install scripts as a minimum protection against npm supply chain attachs.

Please verify the packages before installing.
