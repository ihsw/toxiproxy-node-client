import * as rp from "request-promise-native";
import * as HttpStatus from "http-status";
import Proxy from "./Proxy";
import {
  ICreateProxyBody,
  ICreateProxyResponse,
  IGetProxyResponse,
  IPopulateProxiesBody,
  IPopulateProxiesResponse,
  IGetProxiesResponse
} from "./interfaces";

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

  async populate(body: IPopulateProxiesBody): Promise<Proxies> {
    try {
      const res = <IPopulateProxiesResponse>await rp.post({
        body: body,
        json: true,
        url: `${this.host}/populate`
      });

      const proxies: Proxies = {};
      for (const proxyResponse of res.proxies) {
        proxies[proxyResponse.name] = new Proxy(this, proxyResponse);
      }

      return proxies;
    } catch (err) {
      if (!("statusCode" in err)) {
        throw err;
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

  async getVersion(): Promise<string> {
    try {
      return await rp.get({
        json: true,
        url: `${this.host}/version`
      });
    } catch (err) {
      if (!("statusCode" in err)) {
        throw err;
      }

      throw new Error(`Response status was not ${HttpStatus.OK}: ${err.statusCode}`);
    }
  }

  async reset(): Promise<void> {
    try {
      return await rp.post({
        json: true,
        url: `${this.host}/reset`
      });
    } catch (err) {
      if (!("statusCode" in err)) {
        throw err;
      }

      throw new Error(`Response status was not ${HttpStatus.NO_CONTENT}: ${err.statusCode}`);
    }
  }

  async getAll(): Promise<Proxies> {
    try {
      const responses = <IGetProxiesResponse>await rp.get({
        json: true,
        url: `${this.host}/proxies`
      });

      const proxies: Proxies = {};
      for (const name in responses) {
        proxies[name] = new Proxy(this, responses[name]);
      }

      return proxies;
    } catch (err) {
      if (!("statusCode" in err)) {
        throw err;
      }

      throw new Error(`Response status was not ${HttpStatus.OK}: ${err.statusCode}`);
    }
  }
}
