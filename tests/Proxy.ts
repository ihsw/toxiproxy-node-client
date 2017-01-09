import { test } from "ava";
import { createProxy, createToxic } from "../src/TestHelper";
import { Latency } from "../src/Toxic";

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

test.only("Proxy Should refresh toxics", async (t) => {
  const { proxy } = await createProxy(t, "remove-test");

  const attributes = <Latency>{ latency: 1000, jitter: 100 };
  const toxic = await createToxic(t, proxy, "latency", attributes);
  await proxy.refreshToxics();
  const hasToxic = proxy.toxics.reduce((hasToxic, proxyToxic) => {
    if (proxyToxic.name === toxic.name) {
      return true;
    }

    return hasToxic;
  }, false);
  t.is(hasToxic, true);

  return proxy.remove();
});