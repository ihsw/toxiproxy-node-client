import { test } from "ava";
import { createProxy, createToxic } from "../src/TestHelper";
import { Latency } from "../src/Toxic";

test("Toxic Should remove a toxic", async (t) => {
  const { proxy } = await createProxy(t, "remove-toxic-test");

  const attributes = <Latency>{ latency: 1000, jitter: 100 };
  const toxic = await createToxic(t, proxy, "latency", attributes);

  await toxic.remove();
  return proxy.remove();
});

test("Toxic Should refresh", async (t) => {
  const { proxy } = await createProxy(t, "refresh-toxic-test");

  const attributes = <Latency>{ latency: 1000, jitter: 100 };
  const toxic = await createToxic(t, proxy, "latency", attributes);

  const refreshedToxic = await toxic.refresh();
  t.is(toxic.attributes.latency, refreshedToxic.attributes.latency);
  t.is(toxic.attributes.jitter, refreshedToxic.attributes.jitter);

  return proxy.remove();
});