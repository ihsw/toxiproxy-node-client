import axios from "axios";
import Toxiproxy from "./Toxiproxy";
import Toxic, {
    AttributeTypes as ToxicAttributeTypes,
    ToxicJson
} from "./Toxic";
import {
    ICreateProxyResponse,
    IGetProxyResponse,
    IUpdateProxyBody, IUpdateProxyResponse,
    ICreateToxicBody, ICreateToxicResponse,
    IGetToxicsResponse
} from "./interfaces";

export interface ProxyJson {
    name: string;
    listen: string;
    upstream: string;
    enabled: boolean;
    toxics: ToxicJson<any>[];
}

export default class Proxy {
    toxiproxy: Toxiproxy;

    name: string;
    listen: string;
    upstream: string;
    enabled: boolean;
    toxics: Toxic<ToxicAttributeTypes>[];

    constructor(toxiproxy: Toxiproxy, body: ICreateProxyResponse | IGetProxyResponse) {
        this.toxics = [];
        this.toxiproxy = toxiproxy;

        const { name, listen, upstream, enabled, toxics } = body;
        this.name = name;
        this.listen = listen;
        this.upstream = upstream;
        this.enabled = enabled;
        this.setToxics(toxics);
    }

    toJson(): ProxyJson {
        return <ProxyJson>{
            enabled: this.enabled,
            listen: this.listen,
            name: this.name,
            toxics: this.toxics.map((toxic) => toxic.toJson()),
            upstream: this.upstream
        };
    }

    setToxics(toxics: IGetToxicsResponse<any>) {
        this.toxics = toxics.map((v: any) => new Toxic<ToxicAttributeTypes>(this, v));
    }

    getHost() {
        return this.toxiproxy.host;
    }

    getPath() {
        return `${this.getHost()}/proxies/${this.name}`;
    }

    async remove(): Promise<void> {
        await axios.delete(this.getPath());
    }

    async update(): Promise<Proxy> {
        const body = <IUpdateProxyBody>{
            enabled: this.enabled,
            listen: this.listen,
            upstream: this.upstream
        };

        const res = await axios.post<IUpdateProxyResponse>(this.getPath(), body);
        return new Proxy(this.toxiproxy, res.data);
    }

    async refreshToxics(): Promise<void> {
        const res = await axios.get<IGetToxicsResponse<any>>(`${this.getPath()}/toxics`);
        this.setToxics(res.data);
    }

    async addToxic<T>(body: ICreateToxicBody<T>): Promise<Toxic<T>> {
        const response = await axios.post<ICreateToxicResponse<T>>(`${this.getPath()}/toxics`, body);
        const toxic = new Toxic<T>(this, response.data);

        this.toxics.push(toxic as Toxic<ToxicAttributeTypes>);
        return toxic;
    }
}