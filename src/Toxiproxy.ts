import axios from "axios";

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

export default class Toxiproxy {
    host: string;
    constructor(host: string) {
        this.host = host;
    }

    async createProxy(body: ICreateProxyBody): Promise<Proxy> {
        const result = await axios.post<ICreateProxyResponse>(`${this.host}/proxies`, body);
        return new Proxy(this, result.data);
    }

    async populate(body: IPopulateProxiesBody): Promise<Proxies> {
        const res = await axios.post<IPopulateProxiesResponse>(`${this.host}/populate`, body);

        const proxies: Proxies = {};
        for (const proxyResponse of res.data.proxies) {
            proxies[proxyResponse.name] = new Proxy(this, proxyResponse);
        }

        return proxies;
    }

    async get(name: string): Promise<Proxy> {
        const result = await axios.get<IGetProxyResponse>(`${this.host}/proxies/${name}`);
        return new Proxy(this, result.data);
    }

    async getVersion(): Promise<string> {
        return await axios.get(`${this.host}/version`);
    }

    async reset(): Promise<void> {
        return await axios.post(`${this.host}/reset`);
    }

    async getAll(): Promise<Proxies> {
        const responses = await axios.get<IGetProxiesResponse>(`${this.host}/proxies`);

        const proxies: Proxies = {

        };
        for (const name in responses.data) {
            proxies[name] = new Proxy(this, responses.data[name]);
        }

        return proxies;
    }
}
