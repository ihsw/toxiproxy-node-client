/// <reference path="../typings/main.d.ts" />
import Toxiproxy, { ICreateProxyBody } from "../src/Toxiproxy";
import Proxy from "../src/Proxy";
import Toxic, { Type as ToxicType, IBody as IToxicBody } from "../src/Toxic";

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
  (toxic?: Toxic): Promise<any>;
}

export default class Helper {
  toxiproxy: Toxiproxy;

  constructor(toxiproxy: Toxiproxy) {
    this.toxiproxy = toxiproxy;
  }

  withProxy(name: string, cb?: IWithProxyCallback): Promise<Proxy> {
    if (!cb) {
      cb = (proxy) => Promise.resolve();
    }

    return new Promise<Proxy>((resolve, reject) => {
      const createBody = <ICreateProxyBody>{
        listen: `localhost:0`,
        name: name,
        upstream: "localhost:6379"
      };
      this.toxiproxy.createProxy(createBody)
        .then((proxy) => {
          cb(proxy)
            .then(() => proxy.remove().then(resolve).catch(reject))
            .catch(reject);
        })
        .catch(reject);
    });
  }

  withToxic(proxy: Proxy, type: ToxicType, cb?: IWithToxicCallback): Promise<Toxic> {
    if (!cb) {
      cb = (toxic) => Promise.resolve();
    }

    return new Promise<Toxic>((resolve, reject) => {
      proxy.addToxic(new Toxic(proxy, <IToxicBody>{ type: type }))
        .then((toxic) => {
          cb(toxic)
            .then(() => toxic.remove().then(resolve).catch(reject))
            .catch(reject);
        })
        .catch(reject);
    });
  }
}