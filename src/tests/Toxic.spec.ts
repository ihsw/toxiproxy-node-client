import {createProxy, createToxic, removeAllProxies} from "../TestHelper";
import { Latency } from "../Toxic";
import { expect, test} from "@jest/globals";

beforeAll(async () => {
    await removeAllProxies();
});

test("Toxic Should remove a toxic", async () => {
    const { proxy } = await createProxy("remove-toxic-test");

    const attributes = <Latency>{ latency: 1000, jitter: 100 };
    const toxic = await createToxic(proxy, "latency", attributes);
    await toxic.remove();

    // verifying that the toxic has been removed from the proxy's toxic list
    const hasToxic = proxy.toxics.reduce((hasToxic, proxyToxic) => {
        if (toxic.name === proxyToxic.name) {
            return true;
        }

        return hasToxic;
    }, false);
    expect(hasToxic).toBe(false);

    return proxy.remove();
});

test("Toxic Should refresh", async () => {
    const { proxy } = await createProxy("refresh-toxic-test");

    const attributes = <Latency>{ latency: 1000, jitter: 100 };
    const toxic = await createToxic(proxy, "latency", attributes);

    const prevToxicity = toxic.toxicity;
    toxic.toxicity = 5;
    await toxic.refresh();
    expect(prevToxicity).toBe(toxic.toxicity);

    return proxy.remove();
});

test("Toxic Should update", async () => {
    const { proxy } = await createProxy( "refresh-toxic-test");

    const attributes = <Latency>{ latency: 1000, jitter: 100 };
    const toxic = await createToxic(proxy, "latency", attributes);
    const newLatency = toxic.attributes.latency = 2000;
    await toxic.update();
    expect(newLatency).toBe(toxic.attributes.latency);

    return proxy.remove();
});