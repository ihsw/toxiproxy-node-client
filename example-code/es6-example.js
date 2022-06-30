"use strict";
const toxiproxyClient = require("../dist/");

const getToxic = (type, attributes) => {
  const toxiproxy = new toxiproxyClient.Toxiproxy("http://localhost:8474");
  const proxyBody = {
    listen: "localhost:0",
    name: "ihsw_test_redis_master",
    upstream: "localhost:6379"
  };
  return toxiproxy.createProxy(proxyBody)
    .then((proxy) => {
      const toxicBody = {
        attributes: attributes,
        type: type
      };
      return proxy.addToxic(new toxiproxyClient.Toxic(proxy, toxicBody));
    });
};

// { attributes: { rate: 1000 },
//   name: 'bandwidth_downstream',
//   stream: 'downstream',
//   toxicity: 1,
//   type: 'bandwidth' }
getToxic("bandwidth", { rate: 1000 })
  .then((toxic) => console.log(toxic.toJson()))
  .catch(console.error);