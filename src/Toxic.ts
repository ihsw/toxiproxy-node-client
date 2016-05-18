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
  [name: string]: number;
}

export interface IBody {
  name: string;
  stream: Direction;
  type: Type;
  toxicity: number;
  attributes: IAttributes;
}

export default class Toxic {
  proxy: Proxy;

  name: string;
  type: Type;
  stream: Direction;
  toxicity: number;
  attributes: IAttributes;

  constructor(proxy: Proxy, body: IBody) {
    this.proxy = proxy;
    this.parseBody(body);
  }

  parseBody(body: IBody) {
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
    return `${this.getHost()}/proxies/${this.proxy.name}/toxics/${this.name}`;
  }

  remove(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      request
        .delete(this.getPath())
        .end((err, res) => {
          if (err) {
            reject(err);
            return;
          } else if (res.status !== HttpStatus.NO_CONTENT) {
            reject(new Error(`Response status was not ${HttpStatus.NO_CONTENT}: ${res.status}`));
            return;
          }

          resolve();
        });
    });
  }

  refresh(): Promise<Toxic> {
    return new Promise<Toxic>((resolve, reject) => {
      request
        .get(this.getPath())
        .end((err, res) => {
          if (err) {
            reject(err);
            return;
          } else if (res.status !== HttpStatus.OK) {
            reject(new Error(`Response status was not ${HttpStatus.OK}: ${res.status}`));
            return;
          }

          this.parseBody(res.body);
          resolve(this);
        });
    });
  }
}