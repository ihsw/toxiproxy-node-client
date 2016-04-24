/// <reference path="../typings/main.d.ts" />
import * as test from "tape";
import Proxy from "../src/Proxy";
import { setup } from "./Helper";

test("Proxy", (t: test.Test) => {
  t.test("Should update a proxy", (st: test.Test) => {
    const { helper } = setup();

    const proxyName = "update-test";
    helper.withProxy(st, proxyName, (proxy: Proxy) => {
      if (!proxy) {
        st.fail("No proxy returned");
        st.end();
        return;
      }

      proxy.enabled = false;
      proxy.update()
        .then((updatedProxy) => {
          st.equal(proxy.enabled, updatedProxy.enabled, "Created and updated proxy have same name");
          st.end();
        })
        .catch((err) => {
          st.fail(err);
          st.end();
        });
    });
  });
});
