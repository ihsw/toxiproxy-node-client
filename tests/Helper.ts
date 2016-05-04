/// <reference path="../typings/main.d.ts" />
import * as test from "tape";
import Toxiproxy, { ICreateProxyBody } from "../src/Toxiproxy";
import Proxy from "../src/Proxy";
import Toxic, { Type as ToxicType } from "../src/Toxic";

export function setup() {
  const toxiproxy = new Toxiproxy("http://localhost:8474");
  const helper = new Helper(toxiproxy);

  return {
    toxiproxy,
    helper
  };
}

export interface IWithProxyCallback {
  (proxy: Proxy): Promise<any>;
}

export interface IWithToxicCallback {
  (toxic?: Toxic): void;
}

export default class Helper {
  toxiproxy: Toxiproxy;

  constructor(toxiproxy: Toxiproxy) {
    this.toxiproxy = toxiproxy;
  }

  withProxy(t: test.Test, name: string, cb?: IWithProxyCallback): Promise<Proxy> {
    return new Promise<Proxy>((resolve, reject) => {
      const createBody = <ICreateProxyBody>{
        listen: `localhost:0`,
        name: name,
        upstream: "localhost:6379"
      };
      this.toxiproxy.createProxy(createBody)
        .then((proxy) => {
          if (cb) {
            cb(proxy)
              .then(resolve)
              .catch(reject);
          }

          proxy.remove()
            .then(resolve)
            .catch(reject);
        })
        .catch(reject);
    });
  }

  withToxic(proxy: Proxy, type: ToxicType): Promise<Toxic> {
    return new Promise<Toxic>((resolve, reject) => {
      proxy.addToxic(new Toxic(proxy, type, {}))
        .then((toxic) => setTimeout(() => resolve(toxic)))
        .catch((err) => reject(err));
    });
  }
}