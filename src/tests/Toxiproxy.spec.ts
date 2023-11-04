import {createProxy, removeAllProxies, toxiproxyUrl} from "../TestHelper";
import Toxiproxy from "../Toxiproxy";
import { ICreateProxyBody } from "../interfaces";
import { expect, test} from "@jest/globals";

beforeAll(async () => {
    await removeAllProxies();
});
test("Toxiproxy Should create a proxy", async () => {
    const { proxy } = await createProxy("create-test");

    return proxy.remove();
});

test("Toxiproxy Should get a proxy", async () => {
    const { proxy: createdProxy, toxiproxy } = await createProxy("get-test");

    const fetchedProxy = await toxiproxy.get(createdProxy.name);
    expect(createdProxy.name).toBe(fetchedProxy.name);

    return createdProxy.remove();
});

test("Toxiproxy Should get version", async () => {
    const toxiproxy = new Toxiproxy(toxiproxyUrl);

    return toxiproxy.getVersion();
});

test("Toxiproxy Should reset", async () => {
    const toxiproxy = new Toxiproxy(toxiproxyUrl);

    return toxiproxy.reset();
});

test("Toxiproxy Should populate", async () => {
    const toxiproxy = new Toxiproxy(toxiproxyUrl);

    // populating with proxies
    interface IProxyBodies {
        [key: string]: ICreateProxyBody;
    }
    const proxyBodies = <IProxyBodies>{
        "get-all-test": {
            listen: "localhost:0",
            name: "get-all-test",
            upstream: "localhost:6379"
        }
    };
    const populateBody = Object.keys(proxyBodies).map((name) => proxyBodies[name]);
    const proxies = await toxiproxy.populate(populateBody);

    // clearing them all out
    return Promise.all(Object.keys(proxies).map((name) => proxies[name].remove()));
});

test("Toxiproxy Should get all proxies", async () => {
    const toxiproxy = new Toxiproxy(toxiproxyUrl);

    const proxy1 = <ICreateProxyBody>{
        listen: "127.0.0.1:9988",
        name: "get-all-test1",
        upstream: "localhost:6379"
    };
    const proxy2 = <ICreateProxyBody>{
        listen: "127.0.0.1:9987",
        name: "get-all-test2",
        upstream: "localhost:12345"
    };
    await toxiproxy.populate([proxy1, proxy2]);

    await toxiproxy.getAll();

    const proxies = await toxiproxy.getAll();
    expect(Object.keys(proxies).length).toBe(2);
    expect(proxies[proxy1.name].name).toBe(proxy1.name);
    expect(proxies[proxy2.name].name).toBe(proxy2.name);
    expect(proxies[proxy1.name].listen).toBe(proxy1.listen);
    expect(proxies[proxy2.name].listen).toBe(proxy2.listen);
    expect(proxies[proxy1.name].upstream).toBe(proxy1.upstream);
    expect(proxies[proxy2.name].upstream).toBe(proxy2.upstream);
});