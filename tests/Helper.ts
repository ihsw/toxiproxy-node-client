/// <reference path="../typings/main.d.ts" />
import * as test from "tape";
import Toxiproxy, { ICreateProxyBody } from "../src/Toxiproxy";
import Proxy from "../src/Proxy";

export function setup() {
  const toxiproxy = new Toxiproxy("http://localhost:8474");
  const helper = new Helper(toxiproxy);

  return {
    toxiproxy,
    helper
  };
}

export interface IWithProxyCallback {
  (err?: Error, proxy?: Proxy): void;
}

export default class Helper {
  toxiproxy: Toxiproxy;

  constructor(toxiproxy: Toxiproxy) {
    this.toxiproxy = toxiproxy;
  }

  withProxy(t: test.Test, name: string, cb?: IWithProxyCallback) {
    const createBody = <ICreateProxyBody>{
      listen: `localhost:0`,
      name: name,
      upstream: "localhost:6379"
    };
    this.toxiproxy.createProxy(createBody)
      .then((proxy) => {
        t.equal(proxy.name, createBody.name, "Create-body and proxy have same name");

        if (cb) {
          cb(null, proxy);
        }

        proxy.remove()
          .then(() => {})
          .catch((err) => cb(err, null));
      })
      .catch((err) => cb(err, null));
  }
}