import * as rp from "request-promise-native";
import * as HttpStatus from "http-status";
import Proxy from "./Proxy";
import { ICreateToxicBody, IGetToxicResponse } from "./interfaces";

export type Direction = "upstream" | "downstream";

export type Type = "latency"
  | "down"
  | "bandwidth"
  | "slow_close"
  | "timeout"
  | "slicer";

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

export type AttributeTypes = Latency | Down | Bandwidth | Slowclose | Timeout | Slicer;

export default class Toxic<T> {
  proxy: Proxy;

  name: string;
  type: Type;
  stream: Direction;
  toxicity: number;
  attributes: T;

  constructor(proxy: Proxy, body: ICreateToxicBody<T>) {
    this.proxy = proxy;
    this.parseBody(body);
  }

  parseBody(body: ICreateToxicBody<T>) {
    const { name, type, stream, toxicity, attributes } = body;
    this.name = name;
    this.type = type;
    this.stream = stream;
    this.toxicity = toxicity;
    this.attributes = attributes;
  }

  getHost() {
    return this.proxy.getHost();
  }

  getPath() {
    return `${this.proxy.getPath()}/toxics/${this.name}`;
  }

  async remove(): Promise<void> {
    try {
      await rp.delete({ url: this.getPath() });
    } catch (err) {
      if (!("statusCode" in err)) {
        throw err;
      }

      throw new Error(`Response status was not ${HttpStatus.NO_CONTENT}: ${err.statusCode}`);
    }
  }

  async refresh(): Promise<Toxic<T>> {
    try {
      const toxic = await new Toxic(this.proxy, <IGetToxicResponse<T>>await rp.get({
        json: true,
        url: `${this.getPath()}`
      }));

      return toxic;
    } catch (err) {
      if (!("statusCode" in err)) {
        throw err;
      }

      throw new Error(`Response status was not ${HttpStatus.OK}: ${err.statusCode}`);
    }
  }
}