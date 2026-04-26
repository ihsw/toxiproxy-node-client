import Proxy from "./Proxy";
import { HttpClient } from "./HttpClient";
import { ToxiproxyError } from "./ToxiproxyError";
import {
    ICreateProxyBody,
    ICreateProxyResponse,
    IGetProxyResponse,
    IPopulateProxiesBody,
    IPopulateProxiesResponse,
    IGetProxiesResponse
} from "./interfaces";

export { ToxiproxyError };

export interface Proxies {
    [name: string]: Proxy;
}


export default class Toxiproxy {
    host: string;
    api: HttpClient;

    constructor(host: string) {
        this.api = new HttpClient();
        this.host = host;
    }

    getApi(): HttpClient {
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
        return await this.api.getText(`${this.host}/version`);
    }

    async reset(): Promise<void> {
        await this.api.post(`${this.host}/reset`);
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
