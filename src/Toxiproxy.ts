import axios, { AxiosError, AxiosInstance } from "axios";

import Proxy from "./Proxy";
import {
    ICreateProxyBody,
    ICreateProxyResponse,
    IGetProxyResponse,
    IPopulateProxiesBody,
    IPopulateProxiesResponse,
    IGetProxiesResponse
} from "./interfaces";

export interface Proxies {
    [name: string]: Proxy;
}

export class ToxiproxyError {
    name: string;
    message: string;
    stack?: string;

    constructor(name: string, message: string, stack?: string) {
        this.name = name;
        this.message = message;
        this.stack = stack;
    }
}

export default class Toxiproxy {
    host: string;
    api: AxiosInstance;

    constructor(host: string) {
        this.api = axios.create();
        this.api.interceptors.response.use((response) => response, (error) => {
            if (error instanceof AxiosError) {
                // Return a simplified error object to avoid "TypeError: Converting circular structure to JSON".
                // Really not sure why this is not the default behavior.
                return Promise.reject(new ToxiproxyError(
                    error.name,
                    error.message,
                    error.stack,
                ));
            }
            return Promise.reject("Unknown error");
        });
        this.host = host;
    }

    getApi(): AxiosInstance {
        return this.api;
    }

    async createProxy(body: ICreateProxyBody): Promise<Proxy> {
        const result = await this.api.post<ICreateProxyResponse>(`${this.host}/proxies`, body);
        return new Proxy(this, result.data);
    }

    async populate(body: IPopulateProxiesBody): Promise<Proxies> {
        const res = await this.api.post<IPopulateProxiesResponse>(`${this.host}/populate`, body);

        const proxies: Proxies = {};
        for (const proxyResponse of res.data.proxies) {
            proxies[proxyResponse.name] = new Proxy(this, proxyResponse);
        }

        return proxies;
    }

    async get(name: string): Promise<Proxy> {
        const result = await this.api.get<IGetProxyResponse>(`${this.host}/proxies/${name}`);
        return new Proxy(this, result.data);
    }

    async getVersion(): Promise<string> {
        return await this.api.get(`${this.host}/version`);
    }

    async reset(): Promise<void> {
        return await this.api.post(`${this.host}/reset`);
    }

    async getAll(): Promise<Proxies> {
        const responses = await this.api.get<IGetProxiesResponse>(`${this.host}/proxies`);

        const proxies: Proxies = {

        };
        for (const name in responses.data) {
            proxies[name] = new Proxy(this, responses.data[name]);
        }

        return proxies;
    }
}
