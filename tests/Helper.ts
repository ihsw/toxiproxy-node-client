/// <reference path="../typings/main.d.ts" />
import * as test from "tape";
import { Promise } from "es6-promise";
import Toxiproxy, { ICreateProxyBody, Proxies } from "../src/Toxiproxy";
import Proxy from "../src/Proxy";

interface IWithProxyCallback {
  (proxy: Proxy): void;
}

export default class Helper {
  toxiproxy: Toxiproxy;
  startPort: number;

  constructor(toxiproxy: Toxiproxy) {
    this.toxiproxy = toxiproxy;
    this.startPort = 5000;
  }

  getPort(): number {
    this.startPort += 1;
    return this.startPort;
  }

  withProxy(t: test.Test, name: string, cb?: IWithProxyCallback) {
    const createBody = <ICreateProxyBody>{
      listen: `localhost:${this.getPort()}`,
      name: name,
      upstream: "localhost:6379"
    };
    this.toxiproxy.createProxy(createBody)
      .then((proxy) => {
        t.equal(proxy.name, createBody.name, "Create-body and proxy have same name");

        if (cb) {
          cb(proxy);
        }

        proxy.remove()
          .then(() =>t.end())
          .catch((err) => {
            t.fail(err);
            t.end();
          });
      })
      .catch((err) => {
        t.fail(err);
        t.end();
      });
  }
}