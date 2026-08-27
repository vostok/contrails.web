# AGENTS.md

React 16 + Redux frontend ("contrails.web") for the Vostok trace-viewer API (`contrails.api`). A trace viewer profiler UI. Pure client-side app; no backend in this repo.

## Setup & environment

- Requires **Node 16.x** (pinned in `package.json` `engines`, `Dockerfile`, CI). Newer Node may break webpack 4 / node-sass style native deps. Use nvm.
- Uses **Yarn** (not npm). Registries point at a private `nexus.kontur.host` mirror (`.yarnrc`/`.npmrc`) — `yarn install` needs access to that host.
- Deprecated-stack repo: React 16, webpack 4, tslint (not eslint), mocha, moment. Match existing style rather than modernizing unless asked.

## Commands (from `package.json`)

```sh
yarn start          # dev server on :3001, --env.apiMode=fake (demo data)
yarn storybook      # Storybook on :6006
yarn test           # mocha test/**/*.test.ts (chai, runs via babel-register)
yarn lint           # tslint --project ./tsconfig.json
yarn verify         # tsc (typecheck, strict, noEmit)
yarn build          # production webpack build
yarn subpath:build  # production build with /contrails baseUrl
yarn vendor:build   # rebuild webpack vendor DLL
```

- Single test: `npx mocha test/Foo.test.ts` (mocha.opts auto-loads babel+polyfill).
- Order when making TS changes: `yarn lint` → `yarn verify` → `yarn test`. Note `verify` runs on the whole project (strict, `noUnusedLocals`), it is not incremental.

## Build gotcha: vendor DLL

`webpack.config.js` uses `DllReferencePlugin` and requires `prebuild/<NODE_ENV>/vendor-manifest.json` to exist at build time. This manifest *is checked in* under `prebuild/development` and `prebuild/production`, so `start`/`build` work out of the box. Only run `yarn vendor:build` if you change vendor bundle deps (see `webpack.vendor.dll.config.js`).

## Source layout

- `src/index.tsx` — entry; registers `wheelPreventDefaultChromeWorkaround`, hot-loader.
- `src/Containers/ContrailsApplication.tsx` — wires Redux store + router; selects API impl by `process.env.API_MODE` (`production` → `ContrailsVostokApi` real HTTP, `fake` → demo data).
- `src/Store/` — Redux actions/reducer/state (thunk middleware injects `{ api }`).
- `src/Domain/` — pure logic: span/trace tree manipulation, time formatting/parsing, API clients, trace-tree fixers.
- `src/Components/` + `src/Containers/` — UI; `src/Commons/ui` is shared UI + the `ui`/`commons` webpack path aliases (see `build/resolve.js`).
- `build/` — webpack rule/alias factories; `prebuild/` — vendor DLL output + checked-in manifests.

## Testing quirks

- Tests live in `test/*.test.ts`, run with mocha + chai + `@babel/register` (no ts-node). Unit-test the pure logic in `src/Domain/` (e.g. `test/DateTimeUtils.test.ts`, `test/TraceTreeUtils.test.ts`).
- Trace-viewer math is time-sensitive; recent fixes addressed hangs on malformed span timestamps (`TraceTreeTimeFixer`, `LostSpanFixer`).

## API proxy (local testing)

Set `--env.apiMode=local-testing --env.apiTarget={vostok|logsearch}` on the dev server to proxy `/api` to a local/backend host instead of the default `fake` demo mode (see `createApiProxy` in `webpack.config.js`).

## CI / deploy

`.gitlab-ci.yml` builds and pushes a Docker image via `Dockerfile.subpath` (nginx serving `dist/`, proxies `/api` → `contrails_api:6302`). Manual-triggered per branch; default branch also pushes `latest`.
