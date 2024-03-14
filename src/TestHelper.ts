import Toxiproxy from "./Toxiproxy";
import Proxy from "./Proxy";
import Toxic from "./Toxic";
import { ICreateProxyBody, ICreateToxicBody } from "./interfaces";

export interface ICreateProxyHelper {
    proxy: Proxy;
    toxiproxy: Toxiproxy;
}

export const toxiproxyUrl = "http://localhost:8474";

export const createProxy = async (name: string): Promise<ICreateProxyHelper> => {
    const toxiproxy = new Toxiproxy(toxiproxyUrl);
    const body = <ICreateProxyBody>{
        listen: "localhost:0",
        name: name,
        upstream: "localhost:6379"
    };
    const proxy = await toxiproxy.createProxy(body);
    return { proxy, toxiproxy };
};

export const createToxic = async <T>(proxy: Proxy, type: string, attributes: T): Promise<Toxic<T>> => {
    const body = <ICreateToxicBody<T>>{
        attributes: attributes,
        type: type
    };

    return await proxy.addToxic(body);
};

export async function removeAllProxies() {
    const toxiproxy = new Toxiproxy(toxiproxyUrl);

    const proxies = await toxiproxy.getAll();
    const promises: Promise<any>[] = [];
    for (const proxyName in proxies) {
        if (proxies.hasOwnProperty(proxyName)) {
            const proxy: Proxy = proxies[proxyName];
            await proxy.remove();
        }
    }
    return Promise.all(promises);
}