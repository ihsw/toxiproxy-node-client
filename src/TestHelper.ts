import { ContextualTestContext } from "ava";
import Toxiproxy from "./Toxiproxy";
import Proxy from "./Proxy";
import { ICreateProxyBody } from "./interfaces";
// import Toxic, { Type as ToxicType, IBody as IToxicBody } from "../src/Toxic";

export interface ICreateProxyHelper {
  proxy: Proxy;
  toxiproxy: Toxiproxy;
}

export const toxiproxyUrl = "http://localhost:8474";

export const createProxy = async (t: ContextualTestContext, name: string): Promise<ICreateProxyHelper> => {
  const toxiproxy = new Toxiproxy(toxiproxyUrl);
  const createBody = <ICreateProxyBody>{
    listen: "localhost:0",
    name: name,
    upstream: "localhost:6379"
  };
  const proxy = await toxiproxy.createProxy(createBody);
  t.is(createBody.name, proxy.name);

  return { proxy, toxiproxy };
};