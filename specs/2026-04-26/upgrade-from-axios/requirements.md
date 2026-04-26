# Requirements: Upgrade from axios to stdlib fetch

## Overview

Replace the `axios` HTTP client dependency with the Node.js standard library
`fetch` API (available globally as of Node.js 18). The change must be
behaviour-preserving for all public API consumers of `toxiproxy-node-client`,
fix all current ESLint errors in `src/`, and leave the unit test suite in a
state that compiles cleanly and is structurally consistent with the new
implementation (tests are NOT to be executed as part of this work).

## Goals

1. Remove the runtime dependency on `axios`.
2. Use the global `fetch` provided by Node.js (>= 18) — no new HTTP libraries.
3. Preserve every public class/method signature exposed via `src/index.ts`
   (`Toxiproxy`, `Proxy`, `Toxic`, helpers, interfaces) so that consumers do
   not see breaking type changes beyond the unavoidable removal of
   `AxiosInstance` from public surface.
4. Preserve the existing `ToxiproxyError` shape and the existing error
   semantics: any non-2xx HTTP response, network failure, or JSON parse
   failure must reject with a `ToxiproxyError` carrying `name`, `message`,
   and (when available) `stack`.
5. Eliminate all current `npm run lint` errors in `src/`.
6. Update unit tests so that they compile (`tsc`) and reference only
   surviving symbols. Do NOT run the test suite as part of this task.

## Non-Goals

- No change to the wire protocol against the Toxiproxy server.
- No change to the build, packaging, or publishing pipeline beyond removing
  `axios` from `package.json`.
- No introduction of polyfills (e.g. `node-fetch`, `undici` direct usage,
  `cross-fetch`).
- No bumping of the supported Node engine beyond what is implied by the
  `fetch` global (Node 18+).

## Functional Requirements

### FR-1 HTTP client abstraction
The current `Toxiproxy.api: AxiosInstance` field MUST be replaced with an
internal HTTP helper that:
- Issues `GET`, `POST`, and `DELETE` requests using global `fetch`.
- Serialises the request body as JSON with `Content-Type: application/json`
  when a body is provided.
- Parses the response body as JSON when the response has a non-empty body
  and the `Content-Type` indicates JSON; otherwise returns the response
  text (used by `getVersion`).
- Throws a `ToxiproxyError` for any response where `response.ok === false`,
  using a message of the form `Request failed with status code <status>`
  to remain compatible with the existing test in
  `src/tests/Proxy.spec.ts` ("Creating the same proxy twice should result
  in an error").

### FR-2 Public API surface
The following public exports MUST keep their names and semantics:
- `Toxiproxy` (default-exported via `src/index.ts`), with methods
  `createProxy`, `populate`, `get`, `getVersion`, `reset`, `getAll`.
- `Proxy` with methods `remove`, `update`, `addToxic`, `getToxic`,
  `toJson`, `getHost`, `getPath`, `getToxiproxy`.
- `Toxic` with methods `remove`, `update`, `toJson`, `getPath`.
- `TestHelper` exports: `toxiproxyUrl`, `createProxy`, `createToxic`,
  `removeAllProxies`, `ICreateProxyHelper`.
- All interfaces in `src/interfaces.ts` and types in `src/Toxic.ts`.

The previously-public `getApi()` method on `Toxiproxy` returning an
`AxiosInstance` MUST be replaced by a method that returns the new internal
HTTP helper (typed). The `Proxy.api` and `Toxic.api` fields MUST be
re-typed to the new helper type.

### FR-3 Error shape
`ToxiproxyError` keeps its current public shape (`name`, `message`,
`stack?`). All rejected promises from the new HTTP helper MUST reject with
a `ToxiproxyError` instance, never with a raw `Response`, `Error`, or
string.

### FR-4 Lint cleanliness
`npm run lint` MUST exit with code 0. Specifically the following current
errors MUST be resolved:
- `@typescript-eslint/no-explicit-any` in `Proxy.ts:19`,
  `TestHelper.ts:37`, `interfaces.ts:54`.
- `no-prototype-builtins` in `TestHelper.ts:39`.
- `@typescript-eslint/no-empty-object-type` in `Toxic.ts:36` and the
  multiple empty-extension interfaces in `interfaces.ts`.

### FR-5 Tests compile
After the refactor `npx tsc --noEmit` MUST succeed for the project,
including the files under `src/tests/`. Tests are not executed in this
task, but any test that referenced `axios`, `AxiosInstance`,
`AxiosError`, etc. MUST be updated to reference the new types/symbols.

## Acceptance Criteria

- [ ] `axios` is removed from `dependencies` and `devDependencies` in
      `package.json`.
- [ ] No `import ... from "axios"` statements remain in `src/`.
- [ ] `npm run lint` exits 0 with no errors and no new warnings.
- [ ] `npx tsc --noEmit` exits 0.
- [ ] `Toxiproxy`, `Proxy`, `Toxic` continue to work against a real
      Toxiproxy server (verified by code review of behaviour parity; the
      test suite is not executed in this task).
- [ ] `ToxiproxyError` is still thrown on HTTP failures with a message
      matching `Request failed with status code <status>`.

## Out-of-scope risks accepted

- Behavioural differences between `axios` automatic JSON handling and the
  manual fetch wrapper (e.g. handling of empty 204 responses) — addressed
  by explicit logic in the new helper.
- Loss of `axios`-specific features like interceptors, request
  cancellation, and progress events — none are used by this client.

