import { test } from "ava";
import { createProxy, createToxic } from "../TestHelper";
import {
  Latency, Bandwidth,
  Slowclose, Timeout, Slicer
} from "../Toxic";

test("Proxy Should add a latency toxic", async (t) => {
  const { proxy } = await createProxy(t, "add-latency-toxic-test");

  const attributes = <Latency>{ latency: 1000, jitter: 100 };
  const toxic = await createToxic(t, proxy, "latency", attributes);
  t.is(attributes.latency, toxic.attributes.latency);
  t.is(attributes.jitter, toxic.attributes.jitter);

  return proxy.remove();
});

test("Proxy Should add a bandwidth toxic", async (t) => {
  const { proxy } = await createProxy(t, "add-bandwidth-toxic-test");

  const attributes = <Bandwidth>{ rate: 1000 };
  const toxic = await createToxic(t, proxy, "bandwidth", attributes);
  t.is(attributes.rate, toxic.attributes.rate);

  return proxy.remove();
});

test("Proxy Should add a slowclose toxic", async (t) => {
  const { proxy } = await createProxy(t, "add-slowclose-toxic-test");

  const attributes = <Slowclose>{ delay: 1000 };
  const toxic = await createToxic(t, proxy, "slow_close", attributes);
  t.is(attributes.delay, toxic.attributes.delay);

  return proxy.remove();
});

test("Proxy Should add a timeout toxic", async (t) => {
  const { proxy } = await createProxy(t, "add-timeout-toxic-test");

  const attributes = <Timeout>{ timeout: 5 * 1000 };
  const toxic = await createToxic(t, proxy, "timeout", attributes);
  t.is(attributes.timeout, toxic.attributes.timeout);

  return proxy.remove();
});

test("Proxy Should add a slicer toxic", async (t) => {
  const { proxy } = await createProxy(t, "add-slicer-toxic-test");

  const attributes = <Slicer>{
    average_size: 1000,
    delay: 1000,
    size_variation: 1000
  };
  const toxic = await createToxic(t, proxy, "slicer", attributes);
  t.is(attributes.average_size, toxic.attributes.average_size);
  t.is(attributes.delay, toxic.attributes.delay);
  t.is(attributes.size_variation, toxic.attributes.size_variation);

  return proxy.remove();
});