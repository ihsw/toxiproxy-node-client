/// <reference path="../typings/main.d.ts" />
import * as test from "tape";
import Proxy from "../src/Proxy";
import { setup } from "./Helper";

test("Toxiproxy", (t: test.Test) => {
  t.test("Should create a proxy", (st: test.Test) => {
    const { helper } = setup();

    helper.withProxy(st, "create-test", (proxy: Proxy) => {
      if (!proxy) {
        st.fail("No proxy returned");
      }

      st.end();
    });
  });

  t.test("Should get all proxies", (st: test.Test) => {
    const { toxiproxy, helper } = setup();

    const proxyName = "get-all-test";
    helper.withProxy(st, proxyName, (proxy: Proxy) => {
      if (!proxy) {
        st.fail("No proxy returned");
        st.end();
        return;
      }

      toxiproxy.getAll()
        .then((proxies) => {
          st.equal(proxies[proxyName].name, proxyName, "Proxy body and fetched proxy have same name");
          st.end();
        })
        .catch((err) => {
          st.fail(err);
          st.end();
        });
    });
  });

  t.test("Should get a proxy", (st: test.Test) => {
    const { toxiproxy, helper } = setup();

    const proxyName = "get-test";
    helper.withProxy(st, proxyName, (proxy: Proxy) => {
      if (!proxy) {
        st.fail("No proxy returned");
        st.end();
        return;
      }

      toxiproxy.get(proxyName)
        .then((proxy) => {
          st.equal(proxy.name, proxyName, "Proxy body and fetched proxy have same name");
          st.end();
        })
        .catch((err) => {
          st.fail(err);
          st.end();
        });
    });
  });
});
