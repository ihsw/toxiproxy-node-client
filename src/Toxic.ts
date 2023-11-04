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

/**
 * Add a delay to all data going through the proxy. The delay is equal to latency +/- jitter.
 */
export interface Latency {
    /**
     * time in milliseconds
     */
    latency: number;
    /**
     * time in milliseconds
     */
    jitter: number;
}

/**
 * Bringing a service down is not technically a toxic in the implementation of Toxiproxy.
 * This is done by POSTing to /proxies/{proxy} and setting the enabled field to false.
 */
export interface Down { }

/**
 * Limit a connection to a maximum number of kilobytes per second.
 */
export interface Bandwidth {
    /**
     * rate in KB/s
     */
    rate: number;
}

/**
 * Delay the TCP socket from closing until delay has elapsed.
 */
export interface Slowclose {
    /**
     * time in milliseconds
     */
    delay: number;
}

/**
 * Stops all data from getting through, and closes the connection after timeout.
 * If timeout is 0, the connection won't close, and data will be delayed until the toxic is removed.
 */
export interface Timeout {
    /**
     * time in milliseconds
     */
    timeout: number;
}

/**
 * Slices TCP data up into small bits, optionally adding a delay between each sliced "packet".
 */
export interface Slicer {
    /**
     * size in bytes of an average packet
     */
    average_size: number;
    /**
     * variation in bytes of an average packet (should be smaller than average_size)
     */
    size_variation: number;
    /**
     * time in microseconds to delay each packet by
     */
    delay: number;
}

/**
 * Simulate TCP RESET (Connection reset by peer) on the connections
 * by closing the stub Input immediately or after a timeout.
 */
export interface ResetPeer {
    /**
     * time in milliseconds
     */
    timeout: number;
}

/**
 * Closes connection when transmitted data exceeded limit.
 */
export interface LimitData {
    /**
     * number of bytes it should transmit before connection is closed
     */
    bytes: number;
}

export type AttributeTypes = Latency | Down | Bandwidth | Slowclose | Timeout | Slicer | ResetPeer | LimitData;

export interface ToxicJson<T> {
    /**
     * Toxic name
     */
    name: string;
    /**
     * Toxic type
     */
    type: Type;
    /**
     * The stream direction must be either upstream or downstream.
     * upstream applies the toxic on the client -> server connection,
     * while downstream applies the toxic on the server -> client connection.
     * This can be used to modify requests and responses separately.
     *
     * defaults to downstream
     */
    stream: Direction;
    /**
     * Percentage of connections the toxic will affect.
     *
     * defaults to 1.0 (100%)
     */
    toxicity: number;
    /**
     * Toxic attributes
     */
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