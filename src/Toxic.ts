/// <reference path="../typings/main.d.ts" />
import * as request from "superagent";
import * as HttpStatus from "http-status";
import { Promise } from "es6-promise";
import Proxy from "./Proxy";

export type Direction = "upstream" | "downstream";
export type Type = "latency"
  | "down"
  | "bandwidth"
  | "slow_close"
  | "timeout"
  | "slicer";

export interface IAttributes {
  [name: string]: string;
}

export default class Toxic {
  proxy: Proxy;

  name: string;
  type: Type;
  stream: Direction;
  toxicity: number;
  attributes: IAttributes;

  constructor(proxy: Proxy, type: Type, body: any) {
    this.proxy = proxy;
    this.type = type;

    const { name, stream, toxicity, attributes } = body;
    this.name = name;
    this.stream = stream;
    this.toxicity = toxicity;
    this.attributes = attributes;
  }

  getHost() {
    return this.proxy.getHost();
  }

  remove(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      request
        .delete(`${this.getHost()}/proxies/${this.proxy.name}/toxics/${this.name}`)
        .end((err, res) => {
          if (err) {
            reject(err);
            return;
          } else if (res.status !== HttpStatus.NO_CONTENT) {
            reject(new Error(`Response status was not ${HttpStatus.OK}: ${res.status}`));
            return;
          }

          resolve({});
        });
    });
  }
}