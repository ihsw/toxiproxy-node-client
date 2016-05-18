/// <reference path="../typings/main.d.ts" />
import * as request from "superagent";
import * as HttpStatus from "http-status";
import * as async from "async";
import * as _ from "lodash";
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

  getAll(): Promise<Proxies> {
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

          resolve(<Proxies>_.mapValues(res.body, (body) => new Proxy(this, body)));
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
            reject(err);
            return;
          } else if (res.status !== HttpStatus.CREATED) {
            reject(new Error(`Response status was not ${HttpStatus.CREATED}: ${res.status}`));
            return;
          }

          resolve(new Proxy(this, res.body));
        });
    });
  }

  removeAll(proxies: Proxies): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      async.forEachOf(proxies, (proxy: Proxy, name: string, cb: Function) => {
        proxy.remove()
          .then(() => cb())
          .catch((err) => cb(err));
      }, (err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  }

  get(name: string): Promise<Proxy> {
    return new Promise<Proxy>((resolve, reject) => {
      request
        .get(`${this.host}/proxies/${name}`)
        .end((err, res) => {
          if (err) {
            reject(err);
            return;
          } else if (res.status !== HttpStatus.OK) {
            reject(new Error(`Response status was not ${HttpStatus.OK}: ${res.status}`));
            return;
          }

          resolve(new Proxy(this, res.body));
        });
    });
  }
}
