/// <reference path="../typings/main.d.ts" />
import * as request from "request";
import * as HttpStatus from "http-status";

interface IGetProxyCallback {
  (err: any, body?: any): void;
}

export default class Toxiproxy {
  host: string;
  constructor(host: string) {
    this.host = host;
  }

  getProxies(cb: IGetProxyCallback) {
    request.get(`${this.host}/proxies`, (err, res, body) => {
      if (err) {
        cb(err);
        return;
      } else if (res.statusCode !== HttpStatus.OK) {
        cb(new Error(`Response status was not ${HttpStatus.OK}`));
        return;
      }

      cb(null, body);
    });
  }
}