import { ToxiproxyError } from "./ToxiproxyError";

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
        const res = await this.doFetch(url, { method: "GET" });
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
        const res = await this.doFetch(url, init);
        const text = await res.text();
        if (text.length === 0) {
            return { data: undefined as T };
        }
        try {
            return { data: JSON.parse(text) as T };
        } catch (e) {
            const err = e instanceof Error ? e : new Error(String(e));
            throw new ToxiproxyError(err.name, err.message, err.stack);
        }
    }

    private async doFetch(url: string, init: RequestInit): Promise<Response> {
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

