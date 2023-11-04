import {createProxy, createToxic, removeAllProxies} from "../TestHelper";
import {
    Latency, Bandwidth,
    Slowclose, Timeout, Slicer, ResetPeer, LimitData
} from "../Toxic";
import { expect, test} from "@jest/globals";

beforeAll(async () => {
    await removeAllProxies();
});

test("Proxy Should add a latency toxic", async () => {
    const { proxy } = await createProxy("add-latency-toxic-test");

    const attributes = <Latency>{ latency: 1000, jitter: 100 };
    const toxic = await createToxic(proxy, "latency", attributes);
    expect(attributes.latency).toBe(toxic.attributes.latency);
    expect(attributes.jitter).toBe(toxic.attributes.jitter);

    return proxy.remove();
});

test("Proxy Should add a bandwidth toxic", async () => {
    const { proxy } = await createProxy("add-bandwidth-toxic-test");

    const attributes = <Bandwidth>{ rate: 1000 };
    const toxic = await createToxic(proxy, "bandwidth", attributes);
    expect(attributes.rate).toBe(toxic.attributes.rate);

    return proxy.remove();
});

test("Proxy Should add a slowclose toxic", async () => {
    const { proxy } = await createProxy("add-slowclose-toxic-test");

    const attributes = <Slowclose>{ delay: 1000 };
    const toxic = await createToxic(proxy, "slow_close", attributes);
    expect(attributes.delay).toBe(toxic.attributes.delay);

    return proxy.remove();
});

test("Proxy Should add a timeout toxic", async () => {
    const { proxy } = await createProxy("add-timeout-toxic-test");

    const attributes = <Timeout>{ timeout: 5 * 1000 };
    const toxic = await createToxic(proxy, "timeout", attributes);
    expect(attributes.timeout).toBe(toxic.attributes.timeout);

    return proxy.remove();
});

test("Proxy Should add a slicer toxic", async () => {
    const { proxy } = await createProxy("add-slicer-toxic-test");

    const attributes = <Slicer>{
        average_size: 1000,
        delay: 1000,
        size_variation: 1000
    };
    const toxic = await createToxic(proxy, "slicer", attributes);
    expect(attributes.average_size).toBe(toxic.attributes.average_size);
    expect(attributes.delay).toBe(toxic.attributes.delay);
    expect(attributes.size_variation).toBe(toxic.attributes.size_variation);

    return proxy.remove();
});

test("Proxy Should add a reset_peer toxic", async () => {
    const { proxy } = await createProxy("add-reset_peer-toxic-test");

    const attributes = <ResetPeer>{ timeout: 1000 };
    const toxic = await createToxic(proxy, "reset_peer", attributes);
    expect(attributes.timeout).toBe(toxic.attributes.timeout);

    return proxy.remove();
});

test("Proxy Should add a limit_data toxic", async () => {
    const { proxy } = await createProxy("add-limit_data-toxic-test");

    const attributes = <LimitData>{ bytes: 42 };
    const toxic = await createToxic(proxy, "limit_data", attributes);
    expect(attributes.bytes).toBe(toxic.attributes.bytes);

    return proxy.remove();
});