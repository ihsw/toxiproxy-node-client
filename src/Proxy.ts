import Toxiproxy from "./Toxiproxy";
import Toxic, {
    ToxicJson
} from "./Toxic";
import {
    ICreateProxyResponse,
    IGetProxyResponse,
    IUpdateProxyBody, IUpdateProxyResponse,
    ICreateToxicBody, ICreateToxicResponse,
    IGetToxicResponse
} from "./interfaces";
import { AxiosInstance } from "axios";

export interface ProxyJson {
    name: string;
    listen: string;
    upstream: string;
    enabled: boolean;
    toxics: ToxicJson<any>[];
}

export default class Proxy {
    readonly toxiproxy: Toxiproxy;
    readonly api: AxiosInstance;

    readonly name: string;
    readonly listen: string;
    readonly upstream: string;
    readonly enabled: boolean;

    constructor(toxiproxy: Toxiproxy, body: ICreateProxyResponse | IGetProxyResponse) {
        this.api = toxiproxy.api;
        this.toxiproxy = toxiproxy;

        const { name, listen, upstream, enabled } = body;
        this.name = name;
        this.listen = listen;
        this.upstream = upstream;
        this.enabled = enabled;
    }

    getToxiproxy(): Toxiproxy {
        return this.toxiproxy;
    }

    toJson(): ProxyJson {
        return <ProxyJson>{
            enabled: this.enabled,
            listen: this.listen,
            name: this.name,
            upstream: this.upstream
        };
    }

    getHost() {
        return this.toxiproxy.host;
    }

    getPath() {
        return `${this.getHost()}/proxies/${this.name}`;
    }

    /**
     * Deletes the proxy from the server.
     */
    async remove(): Promise<void> {
        await this.api.delete(this.getPath());
    }

    /**
     * Updates the existing proxy on the server (e.g. disable an enabled proxy).
     *
     * @returns updated proxy
     */
    async update(body: IUpdateProxyBody): Promise<Proxy> {
        return await this.api.post<IUpdateProxyResponse>(this.getPath(), body)
            .then((response) => {
                return new Proxy(this.toxiproxy, response.data);
            });
    }

    /**
     * Adds a new toxic to the proxy.
     *
     * @param body toxic attributes
     * @returns toxic
     */
    async addToxic<T>(body: ICreateToxicBody<T>): Promise<Toxic<T>> {
        const result = await this.api.post<ICreateToxicResponse<T>>(`${this.getPath()}/toxics`, body)
            .then((response) => {
                return response.data;
            });
        return new Toxic<T>(this.api, this.getPath(), result);
    }

    /**
     * Gets the toxic from the proxy.
     *
     * @param name toxic name
     * @returns toxic
     */
    async getToxic<T>(name: string): Promise<Toxic<T>> {
        const result = await this.api.get<IGetToxicResponse<T>>(`${this.getPath()}/toxics/${name}`)
            .then((response) => {
                return response.data;
            });
        return new Toxic<T>(this.api, this.getPath(), result);
    }
}