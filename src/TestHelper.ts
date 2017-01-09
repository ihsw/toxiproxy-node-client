import { ContextualTestContext } from "ava";
import Toxiproxy from "./Toxiproxy";
import Proxy from "./Proxy";
import Toxic from "./Toxic";
import { ICreateProxyBody, ICreateToxicBody } from "./interfaces";

export interface ICreateProxyHelper {
  proxy: Proxy;
  toxiproxy: Toxiproxy;
}

export const toxiproxyUrl = "http://localhost:8474";

export const createProxy = async (t: ContextualTestContext, name: string): Promise<ICreateProxyHelper> => {
  const toxiproxy = new Toxiproxy(toxiproxyUrl);
  const body = <ICreateProxyBody>{
    listen: "localhost:0",
    name: name,
    upstream: "localhost:6379"
  };
  const proxy = await toxiproxy.createProxy(body);
  t.is(body.name, proxy.name);

  return { proxy, toxiproxy };
};

export const createToxic = async <T>(t: ContextualTestContext, proxy: Proxy, type: string, attributes: T): Promise<Toxic<T>> => {
  const body = <ICreateToxicBody<T>>{
    attributes: attributes,
    type: type
  };

  const toxic = await proxy.addToxic(body);
  t.is(body.type, toxic.type);
  t.is(toxic.name, proxy.toxics[proxy.toxics.length - 1].name);

  return toxic;
};