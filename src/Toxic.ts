// import * as request from "request-promise";
// import * as HttpStatus from "http-status";
import Proxy from "./Proxy";
import { ICreateToxicBody } from "./interfaces";

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
    return `${this.getHost()}/proxies/${this.proxy.name}/toxics/${this.type}`;
  }

  // remove(): Promise<void> {
  //   return new Promise<void>((resolve, reject) => {
  //     request
  //       .delete(this.getPath())
  //       .end((err, res) => {
  //         if (err) {
  //           reject(err);
  //           return;
  //         } else if (res.status !== HttpStatus.NO_CONTENT) {
  //           reject(new Error(`Response status was not ${HttpStatus.NO_CONTENT}: ${res.status}`));
  //           return;
  //         }

  //         resolve();
  //       });
  //   });
  // }

  // refresh(): Promise<Toxic> {
  //   return new Promise<Toxic>((resolve, reject) => {
  //     request
  //       .get(this.getPath())
  //       .end((err, res) => {
  //         if (err) {
  //           reject(err);
  //           return;
  //         } else if (res.status !== HttpStatus.OK) {
  //           reject(new Error(`Response status was not ${HttpStatus.OK}: ${res.status}`));
  //           return;
  //         }

  //         this.parseBody(res.body);
  //         resolve(this);
  //       });
  //   });
  // }
}