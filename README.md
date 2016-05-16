# Toxiproxy Node Client
[![Build Status](https://travis-ci.org/ihsw/toxiproxy-node-client.svg?branch=master)](https://travis-ci.org/ihsw/toxiproxy-node-client)

[Toxiproxy](https://github.com/shopify/toxiproxy) makes it easy and trivial to test network conditions, for example low-bandwidth and high-latency situations. `toxiproxy-node-client` includes everything needed to get started with configuring Toxiproxy upstream connection and listen endpoints.

## Installing via NPM
The recommended way to install `toxiproxy-node-client` is through [NPM](https://www.npmjs.com/).

Once that is installed and you have added `toxiproxy-node-client` to your `package.json` configuration, you can require the package and start using the library.

## JavaScript (ES5) Usage
Here is an example for creating a proxy that limits a Redis connection to 1000KB/s.

```js
// index.js
"use strict";
var toxiproxyClient = require("toxiproxy-node-client");

var toxiproxy = new toxiproxyClient.Toxiproxy("http://localhost:8474");
var createBody = {
  name: "ihsw_test_redis_master",
  listen: "localhost:0",
  upstream: "localhost:6379"
};
var proxy = toxiproxy.createProxy(createBody);
  .then((proxy) => {
    var options = {
      name: "bandwidth",
      type: "bandwidth",
      attributes: { "rate": 1000 },
      stream: "downstream",
      toxicity: 1
    };
    proxy.addToxic(new toxiproxyClient.Toxic(proxy, options))
      .then((toxic) => console.log(toxic))
      .catch((err) => console.error(err));
  })
  .catch(console.error);
```

## TypeScript Usage
Here is an example for creating a proxy that limits a Redis connection to 1000KB/s.

```typescript
// index.ts
import { Toxiproxy, ICreateProxyBody, Toxic, ICreateToxicBody } from "toxiproxy-node-client";

const toxiproxy = new Toxiproxy("http://localhost:8474");
const createBody = <ICreateProxyBody>{
  name: "ihsw_test_redis_master",
  listen: "localhost:0",
  upstream: "localhost:6379"
};
const proxy = toxiproxy.createProxy(createBody);
  .then((proxy) => {
    const options = <ICreateToxicBody>{
      name: "bandwidth",
      type: "bandwidth",
      attributes: { "rate": 1000 },
      stream: "downstream",
      toxicity: 1
    };
    proxy.addToxic(new Toxic(proxy, options))
      .then((toxic) => console.log(toxic))
      .catch((err) => console.error(err));
  })
  .catch(console.error);
```

## Documentation
Additional examples can be found in the `examples` directory for expected usage.