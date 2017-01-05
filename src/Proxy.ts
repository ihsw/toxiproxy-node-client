import * as rp from "request-promise-native";
import * as HttpStatus from "http-status";
import Toxiproxy from "./Toxiproxy";
import Toxic, { AttributeTypes as ToxicAttributeTypes } from "./Toxic";
import {
  ICreateProxyResponse,
  IGetProxyResponse,
  IUpdateProxyBody, IUpdateProxyResponse,
  ICreateToxicBody, ICreateToxicResponse
} from "./interfaces";

export default class Proxy {
  toxiproxy: Toxiproxy;

  name: string;
  listen: string;
  upstream: string;
  enabled: boolean;
  toxics: Toxic<ToxicAttributeTypes>[];

  constructor(toxiproxy: Toxiproxy, body: ICreateProxyResponse | IGetProxyResponse) {
    this.toxiproxy = toxiproxy;

    const { name, listen, upstream, enabled, toxics } = body;
    this.name = name;
    this.listen = listen;
    this.upstream = upstream;
    this.enabled = enabled;
    this.toxics = toxics.map((v: any) => new Toxic<ToxicAttributeTypes>(this, v));
  }

  getHost() {
      return this.toxiproxy.host;
  }

  getPath() {
    return `${this.getHost()}/proxies/${this.name}`;
  }

  async remove(): Promise<void> {
    try {
      await rp.delete({ url: this.getPath() });
    } catch (err) {
      if (!("statusCode" in err)) {
        throw err;
      }

      throw new Error(`Response status was not ${HttpStatus.NO_CONTENT}: ${err.statusCode}`);
    }
  }

  async update(): Promise<Proxy> {
    try {
      const body = <IUpdateProxyBody>{
        enabled: this.enabled,
        listen: this.listen,
        upstream: this.upstream
      };

      const res = <IUpdateProxyResponse>await rp.post({
        body: body,
        json: true,
        url: `${this.getPath()}`
      });
      return new Proxy(this.toxiproxy, res);
    } catch (err) {
      if (!("statusCode" in err)) {
        throw err;
      }

      throw new Error(`Response status was not ${HttpStatus.OK}: ${err.statusCode}`);
    }
  }

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

  async addToxic(body: ICreateToxicBody<ToxicAttributeTypes>): Promise<Toxic<ToxicAttributeTypes>> {
    try {
      const toxic = await new Toxic(this, <ICreateToxicResponse<ToxicAttributeTypes>>await rp.post({
        body: body,
        json: true,
        url: `${this.getPath()}/toxics`
      }));

      this.toxics.push(toxic);
      return toxic;
    } catch (err) {
      if (!("statusCode" in err)) {
        throw err;
      }

      throw new Error(`Response status was not ${HttpStatus.OK}: ${err.statusCode}`);
    }
  }
}