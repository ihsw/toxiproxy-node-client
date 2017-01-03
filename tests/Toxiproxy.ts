import { test, ContextualTestContext } from "ava";
import Toxiproxy, { ICreateProxyBody } from "../src/Toxiproxy";
import Proxy from "../src/Proxy";

interface ICreateProxyHelper {
  proxy: Proxy;
  toxiproxy: Toxiproxy;
}

const toxiproxyUrl = "http://localhost:8474";

const createProxy = async (t: ContextualTestContext, name: string): Promise<ICreateProxyHelper> => {
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

test("Toxiproxy Should create a proxy", async (t) => {
  const { proxy } = await createProxy(t, "create-test");

  return proxy.remove();
});

test("Toxiproxy Should get a proxy", async (t) => {
  const { proxy: createdProxy, toxiproxy } = await createProxy(t, "get-test");

  const fetchedProxy = await toxiproxy.get(createdProxy.name);
  t.is(createdProxy.name, fetchedProxy.name);

  return createdProxy.remove();
});

test("Toxiproxy Should get version", async () => {
  const toxiproxy = new Toxiproxy(toxiproxyUrl);

  return toxiproxy.getVersion();
});

test("Toxiproxy Should reset", async () => {
  const toxiproxy = new Toxiproxy(toxiproxyUrl);

  return toxiproxy.reset();
});

test("Toxiproxy Should get all proxies", async (t) => {
  const toxiproxy = new Toxiproxy(toxiproxyUrl);

  interface ICreateProxiesDict {
    [key: string]: ICreateProxyBody;
  }
  const createBodies = <ICreateProxiesDict>{
    "get-all-test": {
      listen: "localhost:0",
      name: "get-all-test",
      upstream: "localhost:6379"
    }
  };

  await Promise.all(Object.keys(createBodies).map(
    (name) => toxiproxy.createProxy(createBodies[name])
  ));

  const proxies = await toxiproxy.getAll();
  for (const proxyName in proxies) {
    t.is(createBodies[proxyName].name, proxies[proxyName].name);
  }

  return Promise.all(Object.keys(proxies).map(
    (name) => proxies[name].remove()
  ));
});