/// <reference path="../typings/main.d.ts" />
import * as request from "superagent";
import * as HttpStatus from "http-status";
import * as async from "async";
import { Promise } from "es6-promise";
import Proxy from "./Proxy";

export interface ICreateProxyBody {
  name: string;
  listen: string;
  upstream: string;
  enabled: boolean;
}

export interface Proxies {
  [name: string]: Proxy;
}

export default class Toxiproxy {
  host: string;
  constructor(host: string) {
    this.host = host;
  }

  getProxies(): Promise<Proxies> {
    return new Promise<Proxies>((resolve, reject) => {
      request
        .get(`${this.host}/proxies`)
        .end((err, res) => {
          if (err) {
            reject(new Error(err.response.error.text));
            return;
          } else if (res.status !== HttpStatus.OK) {
            reject(new Error(`Response status was not ${HttpStatus.OK}: ${res.status}`));
            return;
          }

          resolve(<Proxies>res.body);
      });
    });
  }

  createProxy(body: ICreateProxyBody): Promise<Proxy> {
    return new Promise<Proxy>((resolve, reject) => {
      request
        .post(`${this.host}/proxies`)
        .send(body)
        .end((err, res) => {
          if (err) {
            reject(new Error(JSON.parse(err.response.error.text).title));
            return;
          } else if (res.status !== HttpStatus.CREATED) {
            reject(new Error(`Response status was not ${HttpStatus.CREATED}: ${res.status}`));
            return;
          }

          const { name, listen, upstream, enabled, upstream_toxics, downstream_toxics } = res.body;
          const proxy = new Proxy(this);
          proxy.name = name;
          proxy.listen = listen;
          proxy.upstream = upstream;
          proxy.enabled = enabled;
          proxy.upstream_toxics = upstream_toxics;
          proxy.downstream_toxics = downstream_toxics;

          resolve(proxy);
        });
    });
  }

  removeAll(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.getProxies().then((proxies) => {
        async.forEachOf(proxies, (proxy: Proxy, name: string, cb: Function) => {
          proxy.remove()
            .then(() => cb())
            .catch((err) => cb(err));
        }, (err) => reject(err));
      }).catch((err) => reject(err));
    });
  }
}
