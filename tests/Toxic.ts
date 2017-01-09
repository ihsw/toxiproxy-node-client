import { test } from "ava";
import { createProxy, createToxic } from "../src/TestHelper";
import { Latency } from "../src/Toxic";

test("Toxic Should remove a toxic", async (t) => {
  const { proxy } = await createProxy(t, "remove-toxic-test");

  const attributes = <Latency>{ latency: 1000, jitter: 100 };
  const toxic = await createToxic(t, proxy, "latency", attributes);
  await toxic.remove();

  // verifying that the toxic has been removed from the proxy's toxic list
  const hasToxic = proxy.toxics.reduce((hasToxic, proxyToxic) => {
    if (toxic.name === proxyToxic.name) {
      return true;
    }

    return hasToxic;
  }, false);
  t.is(hasToxic, false);

  return proxy.remove();
});

test("Toxic Should refresh", async (t) => {
  const { proxy } = await createProxy(t, "refresh-toxic-test");

  const attributes = <Latency>{ latency: 1000, jitter: 100 };
  const toxic = await createToxic(t, proxy, "latency", attributes);

  const prevToxicity = toxic.toxicity;
  toxic.toxicity = 5;
  await toxic.refresh();
  t.is(prevToxicity, toxic.toxicity);

  return proxy.remove();
});

test("Toxic Should update", async (t) => {
  const { proxy } = await createProxy(t, "refresh-toxic-test");

  const attributes = <Latency>{ latency: 1000, jitter: 100 };
  const toxic = await createToxic(t, proxy, "latency", attributes);
  const newLatency = toxic.attributes.latency = 2000;
  await toxic.update();
  t.is(newLatency, toxic.attributes.latency);

  return proxy.remove();
});