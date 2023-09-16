import axios from "axios";
import Proxy from "./Proxy";
import {
    ICreateToxicBody,
    IGetToxicResponse,
    IUpdateToxicBody, IUpdateToxicResponse
} from "./interfaces";

export type Direction = "upstream" | "downstream";

export type Type = "latency"
| "down"
| "bandwidth"
| "slow_close"
| "timeout"
| "slicer"
| "limit_data"
| "reset_peer";

export interface Latency {
    latency: number;
    jitter: number;
}

export interface Down { }

export interface Bandwidth {
    rate: number;
}

export interface Slowclose {
    delay: number;
}

export interface Timeout {
    timeout: number;
}

export interface Slicer {
    average_size: number;
    size_variation: number;
    delay: number;
}

export interface ResetPeer {
    timeout: number;
}

export type AttributeTypes = Latency | Down | Bandwidth | Slowclose | Timeout | Slicer | ResetPeer;

export interface ToxicJson<T> {
    name: string;
    type: Type;
    stream: Direction;
    toxicity: number;
    attributes: T;
}

export default class Toxic<T> {
    proxy: Proxy;

    name: string;
    type: Type;
    stream: Direction;
    toxicity: number;
    attributes: T;

    constructor(proxy: Proxy, body: ICreateToxicBody<T>) {
        this.name = body.name;
        this.type = body.type;
        this.proxy = proxy;
        this.stream = body.stream;
        this.toxicity = body.toxicity;
        this.attributes = body.attributes;
    }

    parseBody(body: ICreateToxicBody<T>) {
        const { name, type, stream, toxicity, attributes } = body;
        this.name = name;
        this.type = type;
        this.stream = stream;
        this.toxicity = toxicity;
        this.attributes = attributes;
    }

    toJson(): ToxicJson<T> {
        return <ToxicJson<T>>{
            attributes: this.attributes,
            name: this.name,
            stream: this.stream,
            toxicity: this.toxicity,
            type: this.type
        };
    }

    getHost() {
        return this.proxy.getHost();
    }

    getPath() {
        return `${this.proxy.getPath()}/toxics/${this.name}`;
    }

    async remove(): Promise<void> {
        await axios.delete(this.getPath());

        for (const key in this.proxy.toxics) {
            const toxic = this.proxy.toxics[key];
            if (toxic.name === this.name) {
                delete this.proxy.toxics[key];
            }
        }

        return Promise.resolve();
    }

    async refresh(): Promise<void> {
        const res = await  axios.get<IGetToxicResponse<T>>(this.getPath());
        this.parseBody(res.data);

        return Promise.resolve();
    }

    async update(): Promise<void> {
        const body = <IUpdateToxicBody<T>>this.toJson();
        const res = await axios.post<IUpdateToxicResponse<T>>(this.getPath(), body);
        this.parseBody(res.data);

        return Promise.resolve();
    }
}