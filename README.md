Toxiproxy Node Client
====================

[![Build Status](https://travis-ci.org/ihsw/toxiproxy-node-client.svg?branch=master)](https://travis-ci.org/ihsw/toxiproxy-node-client)

[Toxiproxy](https://github.com/shopify/toxiproxy) makes it easy and trivial to test network conditions, for example low-bandwidth and high-latency situations. `toxiproxy-node-client` includes everything needed to get started with configuring Toxiproxy upstream connection and listen endpoints.

Installing via NPM
-----------------------

The recommended way to install `toxiproxy-node-client` is through [NPM](https://www.npmjs.com/).

Once that is installed and you have added `toxiproxy-node-client` to your `package.json` configuration, you can require the package and start using the library.

Here is an example for creating a proxy that limits a Redis connection to 1000KB/s.

```js
"use strict";
const Toxiproxy = require("toxiproxy-node-client").Toxiproxy;

const toxiproxy = new Toxiproxy("http://localhost:8474");
const createBody = {
  name: "ayy",
  listen: "localhost:0",
  upstream: "localhost:6379"
};
const proxy = toxiproxy.createProxy(createBody)
  .then((proxy) => console.log(proxy))
  .catch((err) => console.error(err));
```

Documentation
-------------

Additional examples can be found in the `examples` directory for expected usage.