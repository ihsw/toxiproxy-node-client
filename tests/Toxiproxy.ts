/// <reference path="../typings/main.d.ts" />
import * as test from "tape";
import Proxy from "../src/Proxy";
import { setup } from "./Helper";

test("Toxiproxy", (t: test.Test) => {
  t.test("Should create a proxy", (st: test.Test) => {
    const { helper } = setup();

    helper.withProxy(st, "create-test", (err, proxy) => st.end(err));
  });

  t.test("Should get all proxies", (st: test.Test) => {
    const { toxiproxy, helper } = setup();

    const proxyName = "get-all-test";
    helper.withProxy(st, proxyName, (err, proxy) => {
      if (!proxy) {
        return st.end(err);
      }

      toxiproxy.getAll()
        .then((proxies) => {
          st.equal(proxies[proxyName].name, proxyName, "Proxy body and fetched proxy have same name");
          st.end();
        })
        .catch((err) => st.end(err));
    });
  });

  t.test("Should get a proxy", (st: test.Test) => {
    const { toxiproxy, helper } = setup();

    const proxyName = "get-test";
    helper.withProxy(st, proxyName, (err, proxy) => {
      if (err) {
        return st.end(err);
      }

      toxiproxy.get(proxyName)
        .then((proxy) => {
          st.equal(proxy.name, proxyName, "Proxy body and fetched proxy have same name");
          st.end();
        })
        .catch((err) => st.end(err));
    });
  });
});
