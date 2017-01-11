# Toxiproxy Node Client
[![Build Status](https://travis-ci.org/ihsw/toxiproxy-node-client.svg?branch=master)](https://travis-ci.org/ihsw/toxiproxy-node-client)
[![NPM version](https://img.shields.io/npm/v/toxiproxy-node-client.svg)](https://www.npmjs.com/package/toxiproxy-node-client)

[Toxiproxy](https://github.com/shopify/toxiproxy) makes it easy and trivial to test network conditions, for example low-bandwidth and high-latency situations. `toxiproxy-node-client` includes everything needed to get started with configuring Toxiproxy upstream connection and listen endpoints.

## Installing via NPM
The recommended way to install `toxiproxy-node-client` is through [NPM](https://www.npmjs.com/).

Once that is installed and you have added `toxiproxy-node-client` to your `package.json` configuration, you can require the package and start using the library.

## JavaScript (ES6) Usage
Here is an example for creating a proxy that limits a Redis connection to 1000KB/s.

```js
// index.js
"use strict";
const toxiproxyClient = require("toxiproxy-node-client");

const getToxic = (type, attributes) => {
  return new Promise((resolve, reject) => {
    const toxiproxy = new toxiproxyClient.Toxiproxy("http://localhost:8474");
    const proxyBody = {
      listen: "localhost:0",
      name: "ihsw_test_redis_master",
      upstream: "localhost:6379"
    };
    toxiproxy.createProxy(proxyBody)
      .then((proxy) => {
        const toxicBody = {
          attributes: attributes,
          type: type
        };
        return proxy.addToxic(new toxiproxyClient.Toxic(proxy, toxicBody));
      })
      .then(resolve)
      .catch(reject);
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
```

## TypeScript Usage
Here is an example for creating a proxy that limits a Redis connection to 1000KB/s.

```typescript
// index.ts
import {
    Toxiproxy,
    ICreateProxyBody,
    Toxic, ICreateToxicBody, Bandwidth
} from "toxiproxy-node-client";

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
  return await proxy.addToxic(new Toxic(proxy, toxicBody));
};

// { attributes: { rate: 1000 },
//   name: 'bandwidth_downstream',
//   stream: 'downstream',
//   toxicity: 1,
//   type: 'bandwidth' }
getToxic("bandwidth", <Bandwidth>{ rate: 1000 })
  .then((toxic) => console.log(toxic.toJson()))
  .catch(console.error);
```

## Documentation
Additional examples can be found in the `examples` directory for expected usage.
