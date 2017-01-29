import { test } from "ava";
import { createProxy, toxiproxyUrl } from "../TestHelper";
import Toxiproxy from "../Toxiproxy";
import { ICreateProxyBody } from "../interfaces";

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

test("Toxiproxy Should populate", async () => {
  const toxiproxy = new Toxiproxy(toxiproxyUrl);

  // populating with proxies
  interface IProxyBodies {
    [key: string]: ICreateProxyBody;
  }
  const proxyBodies = <IProxyBodies>{
    "get-all-test": {
      listen: "localhost:0",
      name: "get-all-test",
      upstream: "localhost:6379"
    }
  };
  const populateBody = Object.keys(proxyBodies).map((name) => proxyBodies[name]);
  const proxies = await toxiproxy.populate(populateBody);

  // clearing them all out
  return Promise.all(Object.keys(proxies).map((name) => proxies[name].remove()));
});

test("Toxiproxy Should get all proxies", async (t) => {
  const toxiproxy = new Toxiproxy(toxiproxyUrl);

  // populating with proxies
  interface IProxyBodies {
    [key: string]: ICreateProxyBody;
  }
  const proxyBodies = <IProxyBodies>{
    "get-all-test": {
      listen: "localhost:0",
      name: "get-all-test",
      upstream: "localhost:6379"
    }
  };
  const populateBody = Object.keys(proxyBodies).map((name) => proxyBodies[name]);
  await toxiproxy.populate(populateBody);

  // fetching them all
  const proxies = await toxiproxy.getAll();
  for (const proxyName in proxies) {
    t.is(proxyBodies[proxyName].name, proxies[proxyName].name);
  }

  // clearing them all out
  return Promise.all(Object.keys(proxies).map((name) => proxies[name].remove()));
});