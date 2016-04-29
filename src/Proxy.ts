/// <reference path="../typings/main.d.ts" />
import * as request from "superagent";
import * as HttpStatus from "http-status";
import { Promise } from "es6-promise";
import Toxiproxy from "./Toxiproxy";
import Toxic from "./Toxic";

export default class Proxy {
  toxiproxy: Toxiproxy;

  name: string;
  listen: string;
  upstream: string;
  enabled: boolean;
  toxics: Toxic[];

  constructor(toxiproxy: Toxiproxy, body: any) {
    this.toxiproxy = toxiproxy;

    const { name, listen, upstream, enabled, toxics } = body;
    this.name = name;
    this.listen = listen;
    this.upstream = upstream;
    this.enabled = enabled;
    this.toxics = toxics.map((v: any) => new Toxic(this, v.type, v));
  }

  getHost() {
      return this.toxiproxy.host;
  }

  remove(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      request
        .delete(`${this.getHost()}/proxies/${this.name}`)
        .end((err, res) => {
          if (err) {
            reject(new Error(err.response.error.text));
            return;
          } else if (res.status !== HttpStatus.NO_CONTENT) {
            reject(new Error(`Response status was not ${HttpStatus.OK}: ${res.status}`));
            return;
          }

          resolve();
        });
    });
  }

  update(): Promise<Proxy> {
    return new Promise<Proxy>((resolve, reject) => {
      const payload = {
        enabled: this.enabled,
        listen: this.listen,
        upstream: this.upstream
      };
      request
        .post(`${this.getHost()}/proxies/${this.name}`)
        .send(payload)
        .end((err, res) => {
          if (err) {
            reject(err);
            return;
          } else if (res.status !== HttpStatus.OK) {
            reject(new Error(`Response status was not ${HttpStatus.OK}: ${res.status}`));
            return;
          }

          resolve(new Proxy(this.toxiproxy, res.body));
        });
    });
  }

  refreshToxics(): Promise<Proxy> {
    return new Promise<Proxy>((resolve, reject) => {
      request
        .get(`${this.getHost()}/proxies/${this.name}/toxics`)
        .end((err, res) => {
          if (err) {
            reject(err);
            return;
          } else if (res.status !== HttpStatus.OK) {
            reject(new Error(`Response status was not ${HttpStatus.OK}: ${res.status}`));
            return;
          }

          resolve(this);
        });
    });
  }

  addToxic(toxic: Toxic): Promise<Proxy> {
    return new Promise<Proxy>((resolve, reject) => {
      const payload = {
        attributes: toxic.attributes,
        name: toxic.name,
        stream: toxic.stream,
        toxicity: toxic.toxicity,
        type: toxic.type
      };
      request
        .post(`${this.getHost()}/proxies/${this.name}/toxics`)
        .send(payload)
        .end((err, res) => {
          if (err) {
            return reject(err);
          } else if (res.status !== HttpStatus.OK) {
            return reject(new Error(`Response status was not ${HttpStatus.OK}: ${res.status}`));
          }

          this.toxics.push(new Toxic(this, res.body.type, {
            attributes: res.body.attributes,
            name: res.body.name,
            stream: res.body.stream,
            toxicity: res.body.toxicity
          }));
          resolve(this);
        });
    });
  }
}