import { test } from "ava";
import Toxiproxy, { ICreateProxyBody } from "../src/Toxiproxy";

test("Toxiproxy Should create a proxy", async () => {
  const toxiproxy = new Toxiproxy("http://localhost:8474");
  const createBody = <ICreateProxyBody>{
    listen: "localhost:0",
    name: "create-test",
    upstream: "localhost:6379"
  };
  return toxiproxy.createProxy(createBody);
});

//   t.test("Should create a proxy", (st: test.Test) => {
//     const { helper, fail } = setup();

//     helper.withProxy("create-test").then(st.end).catch((err) => fail(st, err));
//   });

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

//   t.test("Should get a proxy", (st: test.Test) => {
//     const { toxiproxy, fail, helper } = setup();

//     const proxyName = "get-test";
//     helper.withProxy(proxyName, (proxy) => {
//       return new Promise<Proxy>((resolve, reject) => {
//         toxiproxy.get(proxyName)
//           .then((proxy) => {
//             st.equal(proxy.name, proxyName, "Proxy body and fetched proxy have same name");
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
