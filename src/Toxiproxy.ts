/// <reference path="../typings/main.d.ts" />
import * as request from "superagent";
import * as HttpStatus from "http-status";
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
        .post( `${this.host}/proxies`)
        .send(body)
        .end((err, res) => {
          if (err) {
            // reject(new Error(JSON.parse(err.response.error.text).title));
            reject(err);
            return;
          } else if (res.status !== HttpStatus.CREATED) {
            reject(new Error(`Response status was not ${HttpStatus.CREATED}: ${res.status}`));
            return;
          }

          resolve(<Proxy>body);
        });
    });
  }
}
