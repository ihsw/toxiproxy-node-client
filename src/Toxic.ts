import {
    ICreateToxicBody,
    IUpdateToxicBody, IUpdateToxicResponse
} from "./interfaces";
import { AxiosInstance } from "axios";

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
    readonly latency: number;
    /**
     * time in milliseconds
     */
    readonly jitter: number;
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
    readonly rate: number;
}

/**
 * Delay the TCP socket from closing until delay has elapsed.
 */
export interface Slowclose {
    /**
     * time in milliseconds
     */
    readonly delay: number;
}

/**
 * Stops all data from getting through, and closes the connection after timeout.
 * If timeout is 0, the connection won't close, and data will be delayed until the toxic is removed.
 */
export interface Timeout {
    /**
     * time in milliseconds
     */
    readonly timeout: number;
}

/**
 * Slices TCP data up into small bits, optionally adding a delay between each sliced "packet".
 */
export interface Slicer {
    /**
     * size in bytes of an average packet
     */
    readonly average_size: number;
    /**
     * variation in bytes of an average packet (should be smaller than average_size)
     */
    readonly size_variation: number;
    /**
     * time in microseconds to delay each packet by
     */
    readonly delay: number;
}

/**
 * Simulate TCP RESET (Connection reset by peer) on the connections
 * by closing the stub Input immediately or after a timeout.
 */
export interface ResetPeer {
    /**
     * time in milliseconds
     */
    readonly timeout: number;
}

/**
 * Closes connection when transmitted data exceeded limit.
 */
export interface LimitData {
    /**
     * number of bytes it should transmit before connection is closed
     */
    readonly bytes: number;
}

export type AttributeTypes = Latency | Down | Bandwidth | Slowclose | Timeout | Slicer | ResetPeer | LimitData;

export interface ToxicJson<T> {
    /**
     * Toxic name
     */
    readonly name: string;
    /**
     * Toxic type
     */
    readonly type: Type;
    /**
     * The stream direction must be either upstream or downstream.
     * upstream applies the toxic on the client -> server connection,
     * while downstream applies the toxic on the server -> client connection.
     * This can be used to modify requests and responses separately.
     *
     * defaults to downstream
     */
    readonly stream: Direction;
    /**
     * Percentage of connections the toxic will affect.
     *
     * defaults to 1.0 (100%)
     */
    readonly toxicity: number;
    /**
     * Toxic attributes
     */
    readonly attributes: T;
}

export default class Toxic<T> {
    readonly proxyPath: string;
    readonly api: AxiosInstance;
    readonly name: string;
    readonly type: Type;
    readonly stream: Direction;
    readonly toxicity: number;
    readonly attributes: T;

    constructor(api: AxiosInstance, proxyPath: string, body: ICreateToxicBody<T>) {
        this.api = api;
        this.proxyPath = proxyPath;
        this.name = body.name;
        this.type = body.type;
        this.stream = body.stream;
        this.toxicity = body.toxicity;
        this.attributes = body.attributes;
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

    getPath() {
        return `${this.proxyPath}/toxics/${this.name}`;
    }

    /**
     * Deletes the toxic from the server.
     */
    async remove(): Promise<void> {
        return this.api.delete(this.getPath());
    }

    /**
     * Updates the toxic's attributes on the server.
     *
     * @param body Toxic attributes to update
     * @returns Toxic with updated attributes
     */
    async update(body: IUpdateToxicBody<T>): Promise<Toxic<T>> {
        return await this.api.post<IUpdateToxicResponse<T>>(this.getPath(), body)
            .then((response) => {
                return new Toxic(this.api, this.proxyPath, response.data);
            });
    }
}