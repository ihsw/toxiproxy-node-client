/// <reference path="../typings/main.d.ts" />
import * as test from "tape";
import Toxiproxy, { ICreateProxyBody } from "../src/Toxiproxy";
import Proxy from "../src/Proxy";

export interface IWithProxyCallback {
  (proxy: Proxy): void;
}

export default class Helper {
  toxiproxy: Toxiproxy;

  constructor(toxiproxy: Toxiproxy) {
    this.toxiproxy = toxiproxy;
  }

  withProxy(t: test.Test, name: string, listenPort: number, cb?: IWithProxyCallback) {
    const createBody = <ICreateProxyBody>{
      listen: `localhost:${listenPort}`,
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
          .then(() => t.end())
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