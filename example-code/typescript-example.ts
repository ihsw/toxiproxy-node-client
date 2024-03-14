import { Bandwidth, ICreateProxyBody, ICreateToxicBody, Toxic } from "../src";
import Toxiproxy from "../src/Toxiproxy";


const getToxic = async <T>(type: string, attributes: T): Promise<Toxic<T>> => {
    const toxiproxy = new Toxiproxy("http://localhost:8474");
    const proxyBody = <ICreateProxyBody>{
        listen: "localhost:0",
        name: "ihsw_test_redis_master",
        upstream: "localhost:6379"
    };
    const proxy = await toxiproxy.createProxy(proxyBody);

    const toxicBody = <ICreateToxicBody<T>>{
        attributes: attributes,
        type: type
    };
    return await proxy.addToxic(toxicBody);
};

// { attributes: { rate: 1000 },
//   name: 'bandwidth_downstream',
//   stream: 'downstream',
//   toxicity: 1,
//   type: 'bandwidth' }
getToxic("bandwidth", <Bandwidth>{ rate: 1000 })
    .then((toxic) => console.log(toxic.toJson()))
    .catch(console.error);