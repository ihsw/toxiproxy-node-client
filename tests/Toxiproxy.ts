import { test, ContextualTestContext } from "ava";
import Toxiproxy, { ICreateProxyBody } from "../src/Toxiproxy";
import Proxy from "../src/Proxy";

interface ICreateProxyHelper {
  proxy: Proxy;
  toxiproxy: Toxiproxy;
}

const createProxy = async (t: ContextualTestContext, name: string): Promise<ICreateProxyHelper> => {
  const toxiproxy = new Toxiproxy("http://localhost:8474");
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
  const toxiproxy = new Toxiproxy("http://localhost:8474");

  return toxiproxy.getVersion();
});

//   t.test("Should get all proxies", (st: test.Test) => {
//     const { toxiproxy, fail, helper } = setup();

//     const proxyName = "get-all-test";
//     helper.withProxy(proxyName, (proxy) => {
//       return new Promise<Proxy>((resolve, reject) => {
//         toxiproxy.getAll()
//           .then((proxies) => {
//             st.equal(proxies[proxyName].name, proxy.name, "Proxy body and fetched proxy have same name");
//             resolve(proxy);
//           })
//           .catch(reject);
//       });
//     }).then(st.end).catch((err) => fail(st, err));
//   });

//   t.test("Should reset", (st: test.Test) => {
//     const { toxiproxy, fail } = setup();

//     toxiproxy.reset().then(st.end).catch((err) => fail(st, err));
//   });

//   t.test("Should get version", (st: test.Test) => {
//     const { toxiproxy, fail } = setup();

//     toxiproxy.getVersion().then(() => st.end()).catch((err) => fail(st, err));
//   });
// });
