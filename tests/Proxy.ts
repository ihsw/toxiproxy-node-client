import { test } from "ava";
import { createProxy, createToxic } from "../src/TestHelper";
import Toxic, {
  Timeout
  // Latency, Down, Bandwidth,
  // Slowclose, Timeout, Slicer
} from "../src/Toxic";

test("Proxy Should update a proxy", async (t) => {
  const { proxy } = await createProxy(t, "update-proxy-test");

  proxy.enabled = false;
  const updatedProxy = await proxy.update();
  t.is(proxy.enabled, updatedProxy.enabled);

  return proxy.remove();
});

test("Proxy Should remove a proxy", async (t) => {
  const { proxy } = await createProxy(t, "remove-test");

  return proxy.remove();
});

//   t.test("Should refresh toxics", (st: test.Test) => {
//     const { helper, fail } = setup();

//     const proxyName = "refresh-test";
//     helper.withProxy(proxyName, (proxy) => proxy.refreshToxics()).then(st.end).catch((err) => fail(st, err));
//   });
// });
