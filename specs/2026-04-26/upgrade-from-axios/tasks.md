# Tasks: Upgrade from axios to stdlib fetch
Tasks are ordered. Each is small, self-contained, and verifiable.
**Unit tests will NOT be executed as part of this work**; verification is
limited to `npx tsc --noEmit` and `npm run lint`.
## 1. Extract `ToxiproxyError`
- [ ] Create `src/ToxiproxyError.ts` exporting a `ToxiproxyError` class
      that extends `Error` and accepts `(name, message, stack?)`.
- [ ] Re-export `ToxiproxyError` from `src/Toxiproxy.ts` (backwards
      compat).
- [ ] Add `export { ToxiproxyError } from "./ToxiproxyError";` to
      `src/index.ts`.
## 2. Add the new HTTP client
- [ ] Create `src/HttpClient.ts` implementing `HttpClient` with
      `get<T>`, `post<T>`, `delete`, and `getText` as described in
      `design.md`.
- [ ] Wrap `fetch` and `JSON.parse` failures in `ToxiproxyError`.
- [ ] On `!response.ok`, throw `new ToxiproxyError("Error",
      "Request failed with status code ${status}")`.
- [ ] Handle empty bodies (length 0) without calling `JSON.parse`.
## 3. Refactor `src/Toxiproxy.ts`
- [ ] Remove `import axios, { AxiosError, AxiosInstance } from "axios"`.
- [ ] Replace `api: AxiosInstance` with `api: HttpClient`.
- [ ] Construct `this.api = new HttpClient()` (no interceptors).
- [ ] Update `getApi()` return type to `HttpClient`.
- [ ] Update `getVersion()` to call `this.api.getText(...)`.
- [ ] Leave all other methods structurally unchanged (they read
      `result.data`, which `HttpClient` still returns).
## 4. Refactor `src/Proxy.ts`
- [ ] Swap `AxiosInstance` import for `HttpClient`.
- [ ] Re-type `readonly api: HttpClient`.
- [ ] Change `toxics: ToxicJson<any>[]` to `toxics: ToxicJson<unknown>[]`.
## 5. Refactor `src/Toxic.ts`
- [ ] Swap `AxiosInstance` import for `HttpClient`.
- [ ] Re-type `readonly api: HttpClient`.
- [ ] Replace `export interface Down { }` with
      `export type Down = Record<string, never>;`.
- [ ] Verify `AttributeTypes` still references `Down` correctly.
## 6. Refactor `src/interfaces.ts`
- [ ] Convert every empty `interface X extends Y {}` to
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
- [ ] Change `toxics: IToxicResponse<any>[]` to
      `toxics: IToxicResponse<unknown>[]`.
## 7. Refactor `src/TestHelper.ts`
- [ ] Change `Promise<any>[]` to `Promise<unknown>[]`.
- [ ] Replace `proxies.hasOwnProperty(proxyName)` with
      `Object.prototype.hasOwnProperty.call(proxies, proxyName)`.
## 8. Update tests (do not run)
- [ ] Grep `src/tests` for `axios|Axios` and update any references to
      use `ToxiproxyError` / `HttpClient` instead. Current code review
      indicates no test imports axios directly; this step is a
      verification.
- [ ] Confirm the 409 assertion in `Proxy.spec.ts` still matches the new
      error message string.
## 9. Update `package.json`
- [ ] Remove `"axios"` from `dependencies` (and `devDependencies` if
      present).
- [ ] Add `"engines": { "node": ">=18" }`.
- [ ] Run `npm install` (or `npm prune`) to drop axios from
      `node_modules`. (Network/install only — not "running tests".)
## 10. Verify (without running tests)
- [ ] `npx tsc --noEmit` exits 0.
- [ ] `npm run lint` exits 0 with no errors.
- [ ] Manual diff review confirms:
      - No `axios` / `Axios*` symbol remains in `src/`.
      - `ToxiproxyError` is thrown for both transport failures and
        non-2xx responses.
      - Error message format `Request failed with status code <N>` is
        preserved.
- [ ] **Do NOT execute `npm test` / `jest`** as part of this task; the
      requirement is explicitly to leave that to a follow-up.
## Out of scope (explicitly deferred)
- Running the Jest suite against a live Toxiproxy server.
- Replacing the test framework or adopting `node:test`.
- Adding request retries, timeouts, or `AbortController` integration.
- Publishing a new version to npm.
