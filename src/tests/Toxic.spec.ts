import { createProxy, createToxic, removeAllProxies } from "../TestHelper";
import { Latency } from "../Toxic";
import { expect, test } from "@jest/globals";
import { IUpdateToxicBody } from "../interfaces";

beforeAll(async () => {
    await removeAllProxies();
});

test("CRUD for Toxics", async () => {
    const { proxy } = await createProxy("remove-toxic-test");

    // Create
    const attributes = <Latency>{ latency: 1000, jitter: 100 };
    const toxic = await createToxic(proxy, "latency", attributes);
    expect(toxic.name).toBe("latency_downstream");
    expect(toxic.toxicity).toBe(1);
    expect(toxic.attributes.latency).toBe(1000);
    expect(toxic.attributes.jitter).toBe(100);

    // Retrieve
    const toxicFromServer = await proxy.getToxic(toxic.name);
    expect(toxicFromServer.name).toBe(toxic.name);
    expect(toxicFromServer.type).toBe(toxic.type);
    expect(toxicFromServer.stream).toBe(toxic.stream);
    expect(toxicFromServer.toxicity).toBe(toxic.toxicity);

    // Update
    const updatedToxic = await toxic.update(
        <IUpdateToxicBody<Latency>>{
            attributes: <Latency>{ latency: 12345, jitter: 42 }
        }
    );
    expect(updatedToxic.attributes.latency).toBe(12345);
    expect(updatedToxic.attributes.jitter).toBe(42);

    // Delete
    await toxic.remove();
    await proxy.getToxic("latency").catch((error) => {
        expect(error.message).toBe("Request failed with status code 404");
    });

    return proxy.remove();
});

test("Creating the same Toxic twice should result in an error", async () => {
    const { proxy } = await createProxy("duplicate-toxic-test");

    const attributes = <Latency>{ latency: 1000, jitter: 100 };
    await createToxic(proxy, "latency", attributes);
    await createToxic(proxy, "latency", attributes).catch((error) => {
        expect(error.message).toBe("Request failed with status code 409");
    });
    return proxy.remove();
});
