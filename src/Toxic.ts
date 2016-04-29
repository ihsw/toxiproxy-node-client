/// <reference path="../typings/main.d.ts" />
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
}