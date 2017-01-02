import * as rp from "request-promise-native";
// import * as HttpStatus from "http-status";
import Toxiproxy, { ICreateProxyResponse } from "./Toxiproxy";
import Toxic, { Type, Direction, IAttributes } from "./Toxic";

export interface ICreateToxicBody {
  name: string;
  type: Type;
  stream: Direction;
  toxicity: number;
  attributes: IAttributes;
}

export default class Proxy {
  toxiproxy: Toxiproxy;

  name: string;
  listen: string;
  upstream: string;
  enabled: boolean;
  toxics: Toxic[];

  constructor(toxiproxy: Toxiproxy, body: ICreateProxyResponse) {
    this.toxiproxy = toxiproxy;

    const { name, listen, upstream, enabled, toxics } = body;
    this.name = name;
    this.listen = listen;
    this.upstream = upstream;
    this.enabled = enabled;
    this.toxics = toxics.map((v: any) => new Toxic(this, v));
  }

  getHost() {
      return this.toxiproxy.host;
  }

  getPath() {
    return `${this.getHost()}/proxies/${this.name}`;
  }

  remove(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      rp.delete({ url: this.getPath() })
        .then(() => resolve())
        .catch(reject);
    });
  }

  // update(): Promise<Proxy> {
  //   return new Promise<Proxy>((resolve, reject) => {
  //     const payload = {
  //       enabled: this.enabled,
  //       listen: this.listen,
  //       upstream: this.upstream
  //     };
  //     request
  //       .post(this.getPath())
  //       .send(payload)
  //       .end((err, res) => {
  //         if (err) {
  //           reject(err);
  //           return;
  //         } else if (res.status !== HttpStatus.OK) {
  //           reject(new Error(`Response status was not ${HttpStatus.OK}: ${res.status}`));
  //           return;
  //         }

  //         resolve(new Proxy(this.toxiproxy, res.body));
  //       });
  //   });
  // }

  // refreshToxics(): Promise<Proxy> {
  //   return new Promise<Proxy>((resolve, reject) => {
  //     request
  //       .get(`${this.getPath()}/toxics`)
  //       .end((err, res) => {
  //         if (err) {
  //           reject(err);
  //           return;
  //         } else if (res.status !== HttpStatus.OK) {
  //           reject(new Error(`Response status was not ${HttpStatus.OK}: ${res.status}`));
  //           return;
  //         }

  //         resolve(this);
  //       });
  //   });
  // }

  // addToxic(toxic: Toxic): Promise<Toxic> {
  //   return new Promise<Toxic>((resolve, reject) => {
  //     const payload = <ICreateToxicBody>{
  //       attributes: toxic.attributes,
  //       name: toxic.name,
  //       stream: toxic.stream,
  //       toxicity: toxic.toxicity,
  //       type: toxic.type
  //     };
  //     request
  //       .post(`${this.getHost()}/proxies/${this.name}/toxics`)
  //       .send(payload)
  //       .end((err, res) => {
  //         if (err) {
  //           return reject(new Error(err.response.error.text));
  //         } else if (res.status !== HttpStatus.OK) {
  //           return reject(new Error(`Response status was not ${HttpStatus.OK}: ${res.status}`));
  //         }

  //         const toxic = new Toxic(this, {
  //           attributes: res.body.attributes,
  //           name: res.body.name,
  //           stream: res.body.stream,
  //           toxicity: res.body.toxicity,
  //           type: res.body.type
  //         });
  //         this.toxics.push(toxic);
  //         resolve(toxic);
  //       });
  //   });
  // }
}