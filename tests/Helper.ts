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
  (proxy: Proxy): Promise<Proxy>;
}

export interface IWithToxicCallback {
  (toxic?: Toxic): Promise<Toxic>;
}

export default class Helper {
  toxiproxy: Toxiproxy;

  constructor(toxiproxy: Toxiproxy) {
    this.toxiproxy = toxiproxy;
  }

  withProxy(name: string, cb?: IWithProxyCallback): Promise<void> {
    if (!cb) {
      cb = (proxy) => Promise.resolve(proxy);
    }

    return new Promise<void>((resolve, reject) => {
      const createBody = <ICreateProxyBody>{
        listen: `localhost:0`,
        name: name,
        upstream: "localhost:6379"
      };
      this.toxiproxy.createProxy(createBody)
        .then(cb)
        .then((proxy) => proxy.remove())
        .then(() => resolve())
        .catch(reject);
    });
  }

  withToxic(proxy: Proxy, type: ToxicType, cb?: IWithToxicCallback): Promise<void> {
    if (!cb) {
      cb = (toxic) => Promise.resolve(toxic);
    }

    return new Promise<void>((resolve, reject) => {
      proxy.addToxic(new Toxic(proxy, <IToxicBody>{ type: type }))
        .then(cb)
        .then((toxic) => toxic.remove())
        .then(() => resolve())
        .catch(reject);
    });
  }
}