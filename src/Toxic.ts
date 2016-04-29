/// <reference path="../typings/main.d.ts" />
import Proxy from "./Proxy";

export type Direction = "upstream" | "downstream";

export interface IAttributes {
  [name: string]: string;
}

export default class Toxic {
  proxy: Proxy;

  name: string;
  type: string;
  stream: Direction;
  toxicity: number;
  attributes: IAttributes;

  constructor(proxy: Proxy, body: any) {
    this.proxy = proxy;

    const { name, type, stream, toxicity, attributes } = body;
    this.name = name;
    this.type = type;
    this.stream = stream;
    this.toxicity = toxicity;
    this.attributes = attributes;
  }
}