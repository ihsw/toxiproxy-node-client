# Design: Upgrade from axios to stdlib fetch

## Architecture summary

Today, `Toxiproxy` constructs an `AxiosInstance` and shares it (`this.api`)
with every `Proxy` and every `Toxic`. Each call site uses
`api.get<T>()`, `api.post<T>()`, or `api.delete()` and reads `result.data`.

We replace `AxiosInstance` with a small internal class, `HttpClient`, that
exposes a typed surface compatible with the existing call sites:

```ts
class HttpClient {
    get<T>(url: string): Promise<{ data: T }>;
    post<T>(url: string, body?: unknown): Promise<{ data: T }>;
    delete(url: string): Promise<void>;
    getText(url: string): Promise<string>; // used by getVersion
}
```

Returning `{ data: T }` (instead of `T` directly) is a deliberate choice
to minimise diff churn in `Toxiproxy.ts`, `Proxy.ts`, and `Toxic.ts`,
which all read `result.data` / `response.data`.

## File-by-file plan

### `src/HttpClient.ts` (new)

```ts
import { ToxiproxyError } from "./Toxiproxy";

export interface HttpResponse<T> {
    data: T;
}

export class HttpClient {
    async get<T>(url: string): Promise<HttpResponse<T>> {
        return this.request<T>("GET", url);
    }
    async post<T>(url: string, body?: unknown): Promise<HttpResponse<T>> {
        return this.request<T>("POST", url, body);
    }
    async delete(url: string): Promise<void> {
        await this.request<void>("DELETE", url);
    }
    async getText(url: string): Promise<string> {
        const res = await this.fetch(url, { method: "GET" });
        return res.text();
    }

    private async request<T>(
        method: string,
        url: string,
        body?: unknown,
    ): Promise<HttpResponse<T>> {
        const init: RequestInit = { method };
        if (body !== undefined) {
            init.body = JSON.stringify(body);
            init.headers = { "Content-Type": "application/json" };
        }
        const res = await this.fetch(url, init);
        const text = await res.text();
        const data = text.length > 0 ? JSON.parse(text) as T : (undefined as T);
        return { data };
    }

    private async fetch(url: string, init: RequestInit): Promise<Response> {
        let res: Response;
        try {
            res = await fetch(url, init);
        } catch (e) {
            const err = e instanceof Error ? e : new Error(String(e));
            throw new ToxiproxyError(err.name, err.message, err.stack);
        }
        if (!res.ok) {
            throw new ToxiproxyError(
                "Error",
                `Request failed with status code ${res.status}`,
            );
        }
        return res;
    }
}
```

To avoid a circular import between `Toxiproxy.ts` (which exports
`ToxiproxyError`) and `HttpClient.ts`, we lift `ToxiproxyError` into its
own module, `src/ToxiproxyError.ts`, and re-export it from
`src/Toxiproxy.ts` for backwards compatibility:

```ts
// ToxiproxyError.ts
export class ToxiproxyError extends Error {
    constructor(name: string, message: string, stack?: string) {
        super(message);
        this.name = name;
        if (stack !== undefined) this.stack = stack;
    }
}
```

Making `ToxiproxyError` extend `Error` is a strict superset of the
current shape and means the existing test
`expect(error.message).toBe("Request failed with status code 409")`
keeps working when callers throw the error.

### `src/Toxiproxy.ts`

- Remove `import axios, { AxiosError, AxiosInstance } from "axios"`.
- Import and re-export `ToxiproxyError` from `./ToxiproxyError`.
- Replace `api: AxiosInstance` with `api: HttpClient`.
- Drop the interceptor logic (the new `HttpClient` already throws
  `ToxiproxyError`).
- `getApi()` returns `HttpClient`.
- `getVersion()` switches to `this.api.getText(...)`.
- Other methods are mechanically unchanged because `HttpClient` mirrors
  the `{ data }` shape.

### `src/Proxy.ts`

- Replace `import { AxiosInstance } from "axios"` with
  `import { HttpClient } from "./HttpClient"`.
- Re-type `readonly api: HttpClient`.
- Replace the `any` in `toxics: ToxicJson<any>[]` with `unknown` (fixes
  `no-explicit-any`). Same change in `interfaces.ts` (`IToxicResponse<unknown>[]`).

### `src/Toxic.ts`

- Replace `import { AxiosInstance } from "axios"` with
  `import { HttpClient } from "./HttpClient"`.
- Re-type `readonly api: HttpClient`.
- Replace `export interface Down { }` with
  `export type Down = Record<string, never>;` (fixes
  `no-empty-object-type`). Update `AttributeTypes` accordingly.

### `src/interfaces.ts`

- Replace every `interface Foo extends Bar {}` with `type Foo = Bar;`
  (fixes the bulk `no-empty-object-type` errors). Affected:
  `ICreateProxyBody`, `ICreateProxyResponse`, `IPopulateProxiesBody`
  (becomes `type IPopulateProxiesBody = IProxyBody[]`),
  `IGetProxyResponse`, `IUpdateProxyResponse`, `IGetToxicsResponse<T>`
  (becomes `type IGetToxicsResponse<T> = IToxicResponse<T>[]`),
  `ICreateToxicBody<T>`, `ICreateToxicResponse<T>`, `IGetToxicResponse<T>`,
  `IUpdateToxicBody<T>`, `IUpdateToxicResponse<T>`,
  `IToxicResponse<T>` (becomes `type IToxicResponse<T> = IToxicBody<T>;`).
- Replace `toxics: IToxicResponse<any>[]` with
  `toxics: IToxicResponse<unknown>[]`.

Because all of these were declared `interface X extends Y {}` they are
currently structurally identical to `Y`; changing them to type aliases
is a non-breaking refactor.

### `src/TestHelper.ts`

- Replace `Promise<any>[]` with `Promise<unknown>[]`.
- Replace `proxies.hasOwnProperty(proxyName)` with
  `Object.prototype.hasOwnProperty.call(proxies, proxyName)` (fixes
  `no-prototype-builtins`).

### `src/index.ts`

- Add `export { ToxiproxyError } from "./ToxiproxyError";` so consumers
  can still import it. (It was previously exported transitively via
  `Toxiproxy.ts` — keep that re-export too for compatibility.)

### Tests

- `src/tests/Toxiproxy.spec.ts`, `Proxy.spec.ts`, `Toxic.spec.ts`,
  `ToxicTypes.spec.ts`: scan for any `axios`/`Axios*` references. The
  current files do not import axios directly, so the test files should
  continue to compile after the refactor without test-logic changes.
- The error-matching test
  `expect(error.message).toBe("Request failed with status code 409")`
  continues to work because `HttpClient` produces exactly that message
  via `ToxiproxyError`.

### `package.json`

- Remove `"axios"` from `dependencies` (the file currently has no
  `dependencies` block, but if axios is present in node_modules from a
  previous version, ensure it is fully removed). Add an explicit
  `engines` field documenting `"node": ">=18"` to capture the global
  `fetch` requirement.
- Add a `"typecheck": "tsc --noEmit"` entry to `scripts` so that
  type-checking can be run as `npm run typecheck` instead of via `npx`,
  in line with **NFR-2** (no `npx`).
- All verification in this design uses `npm run` scripts only:
  - `npm run lint` — ESLint (already present).
  - `npm run typecheck` — `tsc --noEmit` (added by this change).
  - `npm run build` — full compile (already present).
  No command in this design, in `tasks.md`, or in any tooling we add
  may invoke `npx`.

## Error mapping

| Source | Mapped to |
| --- | --- |
| `fetch` throws (DNS, ECONNREFUSED, abort) | `new ToxiproxyError(err.name, err.message, err.stack)` |
| `response.ok === false` | `new ToxiproxyError("Error", "Request failed with status code <N>")` |
| JSON parse failure | bubbles as a `SyntaxError`; wrapped into `ToxiproxyError` by an outer try/catch around `JSON.parse` (added in implementation) |

## Risks and mitigations

- **Empty 204 response on `DELETE`/`reset`/`update`**: handled by checking
  `text.length > 0` before parsing.
- **Non-JSON `getVersion` response**: covered by the explicit `getText`
  method, which never tries to parse JSON.
- **Lost `AxiosError` discrimination**: callers only inspected
  `error.message`; the new `ToxiproxyError` preserves that field.

