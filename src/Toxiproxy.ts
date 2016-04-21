/// <reference path="../typings/main.d.ts" />
import * as request from "superagent";
import * as HttpStatus from "http-status";
import Proxy from "./Proxy";

export interface IGetProxiesCallback {
  (err: Error, body?: any): void;
}

export interface ICreateProxyCallback {
  (err: Error, proxy?: Proxy): void;
}

export interface ICreateProxyBody {
  name: string;
  listen: string;
  upstream: string;
  enabled: boolean;
}

export default class Toxiproxy {
  host: string;
  constructor(host: string) {
    this.host = host;
  }

  getProxies(cb: IGetProxiesCallback) {
    request
      .get(`${this.host}/proxies`)
      .end((err, res) => {
        if (err) {
          cb(err);
          return;
        } else if (res.status !== HttpStatus.OK) {
          cb(new Error(`Response status was not ${HttpStatus.OK}`));
          return;
        }

        cb(null, res.body);
    });
  }

  createProxy(body: ICreateProxyBody, cb: ICreateProxyCallback) {
    request
      .post( `${this.host}/proxies`)
      .send(body)
      .end((err, res) => {
        if (err) {
          cb(new Error(JSON.parse(err.response.error.text).title));
          return;
        } else if (res.status !== HttpStatus.CREATED) {
          cb(new Error(`Response status was not ${HttpStatus.CREATED}: ${res.status}`));
          return;
        }

        cb(null, <Proxy>body);
      });
  }
}
