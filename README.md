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
const toxiproxy = new toxiproxyClient.Toxiproxy("http://localhost:8474");
const proxyBody = {
  listen: "localhost:0",
  name: "redis",
  upstream: "redis:6379"
};
const toxic = toxiproxy.createProxy(proxyBody)
  .then((proxy) => {
    const toxicBody = {
      attributes: { rate: 1000 },
      type: "bandwidth"
    };
    return proxy.addToxic(toxicBody);
  });
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

const toxiproxy = new Toxiproxy("http://localhost:8474");
const proxyBody = {
  listen: "localhost:0",
  name: "redis",
  upstream: "redis:6379"
};
const proxy = await toxiproxy.createProxy(proxyBody);

const toxicBody = <ICreateToxicBody<T>>{
  attributes: <Bandwidth>{ rate: 1000 },
  type: "bandwidth"
};
const toxic = proxy.addToxic(toxicBody);
```

## Documentation
Additional examples can be found in the `examples` directory for expected usage.

## Docker setup for development and testing

A Toxiproxy instance is needed to run the tests. The easiest way to get one is to use the official Docker image which will make it available on port 8474. The URL (http://localhost:8474) is hard-coded in the tests.
```
docker run --rm -p 8474:8474 ghcr.io/shopify/toxiproxy:latest
```