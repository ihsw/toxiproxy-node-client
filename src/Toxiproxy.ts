import * as rp from "request-promise-native";
import * as HttpStatus from "http-status";
// import * as async from "async";
// import * as _ from "lodash";
import Proxy from "./Proxy";

export interface ICreateProxyBody {
  name: string;
  listen: string;
  upstream: string;
  enabled?: boolean;
}

export interface ICreateProxyResponse {
  name: string;
  listen: string;
  upstream: string;
  enabled: boolean;
  toxics: any[];
}

export interface IGetProxyResponse extends ICreateProxyResponse { }

export interface Proxies {
  [name: string]: Proxy;
}

export default class Toxiproxy {
  host: string;
  constructor(host: string) {
    this.host = host;
  }

  async createProxy(body: ICreateProxyBody): Promise<Proxy> {
    try {
      return new Proxy(this, <ICreateProxyResponse>await rp.post({
        body: body,
        json: true,
        url: `${this.host}/proxies`
      }));
    } catch (err) {
      if (!("statusCode" in err)) {
        throw err;
      }

      if (err.statusCode === HttpStatus.CONFLICT) {
        throw new Error(`Proxy ${body.name} already exists`);
      }

      throw new Error(`Response status was not ${HttpStatus.OK}: ${err.statusCode}`);
    }
  }

  async get(name: string): Promise<Proxy> {
    try {
      return new Proxy(this, <IGetProxyResponse>await rp.get({
        json: true,
        url: `${this.host}/proxies/${name}`
      }));
    } catch (err) {
      if (!("statusCode" in err)) {
        throw err;
      }

      throw new Error(`Response status was not ${HttpStatus.OK}: ${err.statusCode}`);
    }
  }

  // getAll(): Promise<Proxies> {
  //   return new Promise<Proxies>((resolve, reject) => {
  //     request
  //       .get(`${this.host}/proxies`)
  //       .end((err, res) => {
  //         if (err) {
  //           reject(new Error(err.response.error.text));
  //           return;
  //         } else if (res.status !== HttpStatus.OK) {
  //           reject(new Error(`Response status was not ${HttpStatus.OK}: ${res.status}`));
  //           return;
  //         }

  //         resolve(<Proxies>_.mapValues(res.body, (body) => new Proxy(this, body)));
  //     });
  //   });
  // }

  // removeAll(proxies: Proxies): Promise<void> {
  //   return new Promise<void>((resolve, reject) => {
  //     async.forEachOf(proxies, (proxy: Proxy, _, cb: Function) => {
  //       proxy.remove()
  //         .then(() => cb())
  //         .catch((err) => cb(err));
  //     }, (err) => {
  //       if (err) {
  //         reject(err);
  //         return;
  //       }

  //       resolve();
  //     });
  //   });
  // }

  // get(name: string): Promise<Proxy> {
  //   return new Promise<Proxy>((resolve, reject) => {
  //     request
  //       .get(`${this.host}/proxies/${name}`)
  //       .end((err, res) => {
  //         if (err) {
  //           reject(err);
  //           return;
  //         } else if (res.status !== HttpStatus.OK) {
  //           reject(new Error(`Response status was not ${HttpStatus.OK}: ${res.status}`));
  //           return;
  //         }

  //         resolve(new Proxy(this, res.body));
  //       });
  //   });
  // }

  // reset(): Promise<void> {
  //   return new Promise<void>((resolve, reject) => {
  //     request
  //       .post(`${this.host}/reset`)
  //       .end((err, res) => {
  //         if (err) {
  //           reject(err);
  //           return;
  //         } else if (res.status !== HttpStatus.NO_CONTENT) {
  //           reject(new Error(`Response status was not ${HttpStatus.NO_CONTENT}: ${res.status}`));
  //           return;
  //         }

  //         resolve();
  //       });
  //   });
  // }

  // getVersion(): Promise<string> {
  //   return new Promise<string>((resolve, reject) => {
  //     request
  //       .get(`${this.host}/version`)
  //       .end((err, res) => {
  //         if (err) {
  //           reject(err);
  //           return;
  //         } else if (res.status !== HttpStatus.OK) {
  //           reject(new Error(`Response status was not ${HttpStatus.OK}: ${res.status}`));
  //           return;
  //         }

  //         resolve(res.text);
  //       });
  //   });
  // }
}
