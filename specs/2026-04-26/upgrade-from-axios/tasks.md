# Tasks: Upgrade from axios to stdlib fetch
Tasks are ordered. Each is small, self-contained, and verifiable.
**Unit tests will NOT be executed as part of this work.** Verification is
limited to:
- `npm run lint` (already defined in `package.json`).
- `npm run typecheck` (added in Task 9 below).
Per **NFR-2** in `requirements.md`, **`npx` MUST NOT be used** anywhere
in this work. All tooling is invoked via `npm run <script>` or via
binaries on `PATH` after `npm install`. Per **NFR-1**, `npm run lint`
MUST be run after every file edit and MUST exit 0 before the next edit.
## 1. Extract `ToxiproxyError` — DONE
- [x] Create `src/ToxiproxyError.ts` exporting a `ToxiproxyError` class
      that extends `Error` and accepts `(name, message, stack?)`.
- [x] Re-export `ToxiproxyError` from `src/Toxiproxy.ts` (backwards
      compat).
- [x] Add `export { ToxiproxyError } from "./ToxiproxyError";` to
      `src/index.ts`.
## 2. Add the new HTTP client — DONE
- [x] Create `src/HttpClient.ts` implementing `HttpClient` with
      `get<T>`, `post<T>`, `delete`, and `getText` as described in
      `design.md`.
- [x] Wrap `fetch` and `JSON.parse` failures in `ToxiproxyError`.
- [x] On `!response.ok`, throw `new ToxiproxyError("Error",
      "Request failed with status code ${status}")`.
- [x] Handle empty bodies (length 0) without calling `JSON.parse`.
## 3. Refactor `src/Toxiproxy.ts` — DONE
- [x] Remove `import axios, { AxiosError, AxiosInstance } from "axios"`.
- [x] Replace `api: AxiosInstance` with `api: HttpClient`.
- [x] Construct `this.api = new HttpClient()` (no interceptors).
- [x] Update `getApi()` return type to `HttpClient`.
- [x] Update `getVersion()` to call `this.api.getText(...)`.
- [x] Leave all other methods structurally unchanged (they read
      `result.data`, which `HttpClient` still returns).
## 4. Refactor `src/Proxy.ts` — DONE
- [x] Swap `AxiosInstance` import for `HttpClient`.
- [x] Re-type `readonly api: HttpClient`.
- [x] Change `toxics: ToxicJson<any>[]` to `toxics: ToxicJson<unknown>[]`.
## 5. Refactor `src/Toxic.ts` — DONE
- [x] Swap `AxiosInstance` import for `HttpClient`.
- [x] Re-type `readonly api: HttpClient`.
- [x] Replace `export interface Down { }` with
      `export type Down = Record<string, never>;`.
- [x] Verify `AttributeTypes` still references `Down` correctly.
## 6. Refactor `src/interfaces.ts` — DONE
- [x] Convert every empty `interface X extends Y {}` to
      `export type X = Y;`. Concretely:
      - `ICreateProxyBody`
      - `ICreateProxyResponse`
      - `IPopulateProxiesBody` -> `type IPopulateProxiesBody = IProxyBody[];`
      - `IGetProxyResponse`
      - `IUpdateProxyResponse`
      - `IGetToxicsResponse<T>` -> `type IGetToxicsResponse<T> = IToxicResponse<T>[];`
      - `ICreateToxicBody<T>`
      - `ICreateToxicResponse<T>`
      - `IGetToxicResponse<T>`
      - `IUpdateToxicBody<T>`
      - `IUpdateToxicResponse<T>`
      - `IToxicResponse<T>` -> `type IToxicResponse<T> = IToxicBody<T>;`
- [x] Change `toxics: IToxicResponse<any>[]` to
      `toxics: IToxicResponse<unknown>[]`.
## 7. Refactor `src/TestHelper.ts` — DONE
- [x] Change `Promise<any>[]` to `Promise<unknown>[]`.
- [x] Replace `proxies.hasOwnProperty(proxyName)` with
      `Object.prototype.hasOwnProperty.call(proxies, proxyName)`.
## 8. Update tests (do not run) — DONE
- [x] Grep `src/tests` for `axios|Axios` and update any references to
      use `ToxiproxyError` / `HttpClient` instead. Result: no axios
      references existed in tests; nothing to change.
- [x] Confirm the 409 assertion in `Proxy.spec.ts` still matches the new
      error message string. Result: the new `HttpClient` produces
      exactly `"Request failed with status code 409"`.
## 9. Update `package.json`
- [x] Remove `"axios"` from `dependencies` / `devDependencies` (it was
      already absent; verified by grep).
- [x] Add `"engines": { "node": ">=18" }`.
- [x] Add a `"typecheck": "tsc --noEmit"` entry under `scripts` so that
      type-checking is reachable without `npx` (per NFR-2).
- [x] Run `npm prune` to refresh `node_modules` and ensure no stale
      axios artefacts remain. Verified `node_modules/axios` is absent.
      (Install only — NOT "running tests".)
- [x] After this task, run `npm run lint` per NFR-1 — exit 0.

## 10. Verify (without running tests)
- [x] `npm run lint` exits 0 with no errors and no new warnings.
- [x] `npm run typecheck` exits 0.
- [x] `grep -rn -E "axios|Axios" src/ package.json` produces no matches.
- [x] No executable `npx` invocations exist in any source, script, or
      spec authored by this task. Remaining textual `npx` references in
      `specs/` and inside this file are part of the **prohibition rule
      itself** (NFR-2) and describe what is banned; they do not invoke
      `npx`. Confirmed by reviewing every match of
      `grep -rn "npx" specs/ package.json`.
- [x] Manual diff review confirms:
      - No `axios` / `Axios*` symbol remains in `src/`.
      - `ToxiproxyError` is thrown for both transport failures and
        non-2xx responses.
      - Error message format `Request failed with status code <N>` is
        preserved.
- [x] **`npm test` / `jest` was NOT executed** as part of this task; left
      as a follow-up.
## Tooling rules (apply to every task above)
- Use `npm run lint`, `npm run typecheck`, `npm run build` — never
  `npx eslint`, `npx tsc`, etc.
- If a needed command has no `npm run` script, add one to
  `package.json` first, then call it via `npm run <name>`.
## Out of scope (explicitly deferred)
- Running the Jest suite against a live Toxiproxy server.
- Replacing the test framework or adopting `node:test`.
- Adding request retries, timeouts, or `AbortController` integration.
- Publishing a new version to npm.
