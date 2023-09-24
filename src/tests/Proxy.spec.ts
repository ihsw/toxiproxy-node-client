import { createProxy, removeAllProxies } from "../TestHelper";
import { expect, test } from "@jest/globals";
import { IUpdateProxyBody } from "../interfaces";

beforeAll(async () => {
    await removeAllProxies();
});

test("Proxy Should update a proxy", async () => {
    const { proxy } = await createProxy("update-proxy-test");

    const disable = <IUpdateProxyBody>{
        enabled: false,
        listen: proxy.listen,
        upstream: proxy.upstream
    };
    const disabledProxy = await proxy.update(disable);
    expect(disabledProxy.enabled).toBeFalsy();

    const updateUpstream = <IUpdateProxyBody>{
        enabled: true,
        listen: proxy.listen,
        upstream: "somehost:12345"
    };
    const updatedUpstreamProxy = await proxy.update(updateUpstream);
    expect(updatedUpstreamProxy.enabled).toBeTruthy();
    expect(updatedUpstreamProxy.upstream).toBe(updateUpstream.upstream);

    return proxy.remove();
});

test("Proxy Should remove a proxy", async () => {
    const { proxy } = await createProxy("remove-test");

    return proxy.remove();
});

test("Creating the same proxy twice should result in an error", async () => {
    const { proxy } = await createProxy("duplicate");
    await createProxy("duplicate").catch((error) => {
        expect(error.message).toBe("Request failed with status code 409");
    });
    return proxy.remove();
});